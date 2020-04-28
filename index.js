'use strict'

var color = require('./color')

module.exports = color ? inspect : /* istanbul ignore next */ noColor

inspect.color = inspect
noColor.color = inspect
inspect.noColor = noColor
noColor.noColor = noColor

var bold = ansiColor(1, 22)
var dim = ansiColor(2, 22)
var yellow = ansiColor(33, 39)
var green = ansiColor(32, 39)

// Define ANSII color removal functionality.
var colorExpression = /(?:(?:\u001B\[)|\u009B)(?:\d{1,3})?(?:(?:;\d{0,3})*)?[A-M|f-m]|\u001B[A-M]/g

// Standard keys defined by unist (<https://github.com/syntax-tree/unist>) that
// we format differently.
// We don’t ignore `data` though.
// Also includes `name` (from xast) and `tagName` (from `hast`).
var ignore = ['type', 'value', 'children', 'position', 'name', 'tagName']

var dataOnly = ['data', 'attributes', 'properties']

// Inspects a node, without using color.
function noColor(node) {
  return stripColor(inspect(node))
}

// Inspects a node.
function inspect(node, options) {
  var settings = options || {}
  var showPositions = settings.showPositions

  if (showPositions === null || showPositions === undefined) {
    showPositions = true
  }

  return inspectValue(node)

  function inspectValue(node) {
    if (node && Boolean(node.length) && typeof node === 'object') {
      return inspectNodes(node)
    }

    if (node && node.type) {
      return inspectTree(node)
    }

    return inspectNonTree(node)
  }

  function inspectNonTree(value) {
    return JSON.stringify(value)
  }

  function inspectNodes(nodes) {
    var length = nodes.length
    var index = -1
    var result = []
    var node
    var tail
    var value

    while (++index < length) {
      node = nodes[index]
      tail = index === length - 1

      value =
        dim((tail ? '└' : '├') + '─' + index) +
        ' ' +
        indent(inspectValue(node), (tail ? ' ' : dim('│')) + '   ', true)

      result.push(value)
    }

    return result.join('\n')
  }

  function inspectFields(object) {
    var nonEmpty = object.children && object.children.length
    var result = []
    var key
    var value
    var formatted

    for (key in object) {
      value = object[key]

      if (value === undefined || ignore.indexOf(key) !== -1) {
        continue
      }

      if (
        value &&
        typeof value === 'object' &&
        typeof value.type === 'string' &&
        dataOnly.indexOf(key) === -1
      ) {
        formatted = inspectTree(value)
      } else if (
        Array.isArray(value) &&
        value[0] &&
        typeof value[0] === 'object' &&
        typeof value[0].type === 'string'
      ) {
        formatted = '\n' + inspectNodes(value)
      } else {
        formatted = inspectNonTree(value)
      }

      result.push(
        key + dim(':') + (/\s/.test(formatted.charAt(0)) ? '' : ' ') + formatted
      )
    }

    return indent(result.join('\n'), (nonEmpty ? dim('│') : ' ') + ' ')
  }

  function inspectTree(node, pad) {
    var result = [formatNode(node, pad)]
    var fields = inspectFields(node)
    var content = inspectNodes(node.children || [])
    if (fields) result.push(fields)
    if (content) result.push(content)
    return result.join('\n')
  }

  // Colored node formatter.
  function formatNode(node) {
    var result = [bold(node.type)]
    var kind = node.tagName || node.name
    var position = node.position || {}
    var location = showPositions
      ? stringifyPosition(position.start, position.end)
      : ''
    var location = stringifyPosition(position.start, position.end)

    if (kind) {
      result.push('<', kind, '>')
    }

    if (node.children) {
      result.push(dim('['), yellow(node.children.length), dim(']'))
    } else if (typeof node.value === 'string') {
      result.push(' ', green(inspectNonTree(node.value, '')))
    }

    if (location) {
      result.push(' ', dim('('), location, dim(')'))
    }

    return result.join('')
  }
}

function indent(value, indentation, ignoreFirst) {
  var lines = value.split('\n')
  var index = ignoreFirst ? 0 : -1
  var length = lines.length

  if (value === '') return ''

  while (++index < length) {
    lines[index] = indentation + lines[index]
  }

  return lines.join('\n')
}

// Compile a position.
function stringifyPosition(start, end) {
  var result = []
  var positions = []
  var offsets = []

  add(start)
  add(end)

  if (positions.length !== 0) {
    result.push(positions.join('-'))
  }

  if (offsets.length !== 0) {
    result.push(offsets.join('-'))
  }

  return result.join(', ')

  // Add a position.
  function add(position) {
    var tuple = stringifyPoint(position)

    if (tuple) {
      positions.push(tuple[0])

      if (tuple[1]) {
        offsets.push(tuple[1])
      }
    }
  }
}

// Compile a point.
function stringifyPoint(value) {
  var result = []

  if (!value) {
    return null
  }

  result = [[value.line || 1, value.column || 1].join(':')]

  if ('offset' in value) {
    result.push(String(value.offset || 0))
  }

  return result
}

// Remove ANSI color from `value`.
function stripColor(value) {
  return value.replace(colorExpression, '')
}

// Factory to wrap values in ANSI colours.
function ansiColor(open, close) {
  return color

  function color(value) {
    return '\u001B[' + open + 'm' + value + '\u001B[' + close + 'm'
  }
}
