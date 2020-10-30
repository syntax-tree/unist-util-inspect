'use strict'

var color = require('./color')

module.exports = color ? inspect : /* istanbul ignore next */ noColor

inspect.color = noColor.color = inspect
inspect.noColor = noColor.noColor = noColor

var bold = ansiColor(1, 22)
var dim = ansiColor(2, 22)
var yellow = ansiColor(33, 39)
var green = ansiColor(32, 39)

// ANSI color regex.
var colorExpression = /(?:(?:\u001B\[)|\u009B)(?:\d{1,3})?(?:(?:;\d{0,3})*)?[A-M|f-m]|\u001B[A-M]/g

// Inspects a node, without using color.
function noColor(node) {
  return inspect(node).replace(colorExpression, '')
}

// Inspects a node.
function inspect(tree, options) {
  var positions =
    !options || options.showPositions == null ? true : options.showPositions

  return inspectValue(tree)

  function inspectValue(node) {
    if (node && typeof node === 'object' && 'length' in node) {
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
    var result = []
    var index = -1

    while (++index < nodes.length) {
      result.push(
        dim((index < nodes.length - 1 ? '├' : '└') + '─' + index) +
          ' ' +
          indent(
            inspectValue(nodes[index]),
            (index < nodes.length - 1 ? dim('│') : ' ') + '   ',
            true
          )
      )
    }

    return result.join('\n')
  }

  function inspectFields(object) {
    var result = []
    var key
    var value
    var formatted

    for (key in object) {
      value = object[key]

      if (
        value === undefined ||
        // Standard keys defined by unist that we format differently.
        // <https://github.com/syntax-tree/unist>
        key === 'type' ||
        key === 'value' ||
        key === 'children' ||
        key === 'position' ||
        // Ignore `name` (from xast) and `tagName` (from `hast`) when string.
        (typeof value === 'string' && (key === 'name' || key === 'tagName'))
      ) {
        continue
      }

      // A single node.
      if (
        value &&
        typeof value === 'object' &&
        value.type &&
        key !== 'data' &&
        key !== 'attributes' &&
        key !== 'properties'
      ) {
        formatted = inspectTree(value)
      }
      // A list of nodes.
      else if (
        value &&
        typeof value === 'object' &&
        'length' in value &&
        value[0] &&
        value[0].type
      ) {
        formatted = '\n' + inspectNodes(value)
      } else {
        formatted = inspectNonTree(value)
      }

      result.push(
        key + dim(':') + (/\s/.test(formatted.charAt(0)) ? '' : ' ') + formatted
      )
    }

    return indent(
      result.join('\n'),
      (object.children && object.children.length ? dim('│') : ' ') + ' '
    )
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
    var position = positions ? stringifyPosition(node.position) : ''

    if (typeof kind === 'string') {
      result.push('<', kind, '>')
    }

    if (node.children) {
      result.push(dim('['), yellow(node.children.length), dim(']'))
    } else if (typeof node.value === 'string') {
      result.push(' ', green(inspectNonTree(node.value, '')))
    }

    if (position) {
      result.push(' ', dim('('), position, dim(')'))
    }

    return result.join('')
  }
}

function indent(value, indentation, ignoreFirst) {
  var lines = value.split('\n')
  var index = ignoreFirst ? 0 : -1

  if (!value) return value

  while (++index < lines.length) {
    lines[index] = indentation + lines[index]
  }

  return lines.join('\n')
}

// Compile a position.
function stringifyPosition(value) {
  var position = value || {}
  var result = []
  var positions = []
  var offsets = []

  point(position.start)
  point(position.end)

  if (positions.length) result.push(positions.join('-'))
  if (offsets.length) result.push(offsets.join('-'))

  return result.join(', ')

  function point(value) {
    if (value) {
      positions.push((value.line || 1) + ':' + (value.column || 1))

      if ('offset' in value) {
        offsets.push(String(value.offset || 0))
      }
    }
  }
}

// Factory to wrap values in ANSI colours.
function ansiColor(open, close) {
  return color

  function color(value) {
    return '\u001B[' + open + 'm' + value + '\u001B[' + close + 'm'
  }
}
