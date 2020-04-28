'use strict'

var isEmpty = require('is-empty')
var color = require('./color')

module.exports = color ? inspect : /* istanbul ignore next */ noColor

inspect.color = inspect
noColor.color = inspect
inspect.noColor = noColor
noColor.noColor = noColor

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

// Inspects a node, without using color.
function noColor(node) {
  return stripColor(inspect(node))
}

// Inspects a node.
function inspect(node) {
  return inspectValue(node, '')

  function inspectValue(node, pad) {
    if (node && Boolean(node.length) && typeof node === 'object') {
      return inspectAll(node, pad)
    }

    if (node && node.type) {
      return inspectTree(node, pad)
    }

    return inspectNonTree(node, pad)
  }

  function inspectNonTree(value, pad) {
    return formatNesting(pad) + String(value)
  }

  function inspectAll(nodes, pad) {
    var length = nodes.length
    var index = -1
    var result = []
    var node
    var tail

    while (++index < length) {
      node = nodes[index]
      tail = index === length - 1

      result.push(
        formatNesting(pad + (tail ? '└' : '├') + '─ '),
        inspectValue(node, pad + (tail ? ' ' : '│') + '  '),
        tail ? '' : '\n'
      )
    }

    return result.join('')
  }

  function inspectTree(node, pad) {
    var result = formatNode(node, pad)
    var content = inspectAll(node.children || [], pad)
    return content ? result + '\n' + content : result
  }

  // Colored nesting formatter.
  function formatNesting(value) {
    return value ? dim(value) : ''
  }

  // Colored node formatter.
  function formatNode(node) {
    var result = [node.type]
    var kind = node.tagName || node.name
    var position = node.position || {}
    var location = stringifyPosition(position.start, position.end)
    var attributes = []
    var key
    var value

    if (kind) {
      result.push('<', kind, '>')
    }

    if (node.children) {
      result.push(dim('['), yellow(node.children.length), dim(']'))
    } else if (typeof node.value === 'string') {
      result.push(dim(': '), green(JSON.stringify(node.value)))
    }

    if (location) {
      result.push(' (', location, ')')
    }

    for (key in node) {
      value = node[key]

      if (
        ignore.indexOf(key) !== -1 ||
        value === null ||
        value === undefined ||
        (typeof value === 'object' && isEmpty(value))
      ) {
        continue
      }

      attributes.push('[' + key + '=' + JSON.stringify(value) + ']')
    }

    if (attributes.length !== 0) {
      result = result.concat(' ', attributes)
    }

    return result.join('')
  }
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
