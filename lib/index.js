/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Position} Position
 * @typedef {import('unist').Point} Point
 *
 * @typedef Options
 * @property {boolean} [showPositions=true]
 */

import {color} from './color.js'

/* c8 ignore next */
export const inspect = color ? inspectColor : inspectNoColor

const own = {}.hasOwnProperty

const bold = ansiColor(1, 22)
const dim = ansiColor(2, 22)
const yellow = ansiColor(33, 39)
const green = ansiColor(32, 39)

// ANSI color regex.
/* eslint-disable no-control-regex */
const colorExpression =
  /(?:(?:\u001B\[)|\u009B)(?:\d{1,3})?(?:(?:;\d{0,3})*)?[A-M|f-m]|\u001B[A-M]/g
/* eslint-enable no-control-regex */

/**
 * Inspects a node, without using color.
 *
 * @param {unknown} node
 * @param {Options} [options]
 * @returns {string}
 */
export function inspectNoColor(node, options) {
  return inspectColor(node, options).replace(colorExpression, '')
}

/**
 * Inspects a node, using color.
 *
 * @param {unknown} tree
 * @param {Options} [options]
 * @returns {string}
 */
export function inspectColor(tree, options = {}) {
  const positions =
    options.showPositions === null || options.showPositions === undefined
      ? true
      : options.showPositions

  return inspectValue(tree)

  /**
   * @param {unknown} node
   * @returns {string}
   */
  function inspectValue(node) {
    if (node && typeof node === 'object' && 'length' in node) {
      // @ts-expect-error looks like a list of nodes.
      return inspectNodes(node)
    }

    // @ts-expect-error looks like a single node.
    if (node && node.type) {
      // @ts-expect-error looks like a single node.
      return inspectTree(node)
    }

    return inspectNonTree(node)
  }

  /**
   * @param {unknown} value
   * @returns {string}
   */
  function inspectNonTree(value) {
    return JSON.stringify(value)
  }

  /**
   * @param {Array<Node>} nodes
   * @returns {string}
   */
  function inspectNodes(nodes) {
    const size = String(nodes.length - 1).length
    /** @type {Array<string>} */
    const result = []
    let index = -1

    while (++index < nodes.length) {
      result.push(
        dim(
          (index < nodes.length - 1 ? '├' : '└') +
            '─' +
            String(index).padEnd(size)
        ) +
          ' ' +
          indent(
            inspectValue(nodes[index]),
            (index < nodes.length - 1 ? dim('│') : ' ') + ' '.repeat(size + 2),
            true
          )
      )
    }

    return result.join('\n')
  }

  /**
   * @param {Record<string, unknown>} object
   * @returns {string}
   */
  // eslint-disable-next-line complexity
  function inspectFields(object) {
    /** @type {Array<string>} */
    const result = []
    /** @type {string} */
    let key

    for (key in object) {
      /* c8 ignore next 1 */
      if (!own.call(object, key)) continue

      const value = object[key]
      /** @type {string} */
      let formatted

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
        // @ts-expect-error looks like a node.
        value.type &&
        key !== 'data' &&
        key !== 'attributes' &&
        key !== 'properties'
      ) {
        // @ts-expect-error looks like a node.
        formatted = inspectTree(value)
      }
      // A list of nodes.
      else if (
        value &&
        Array.isArray(value) &&
        // Looks like a node.
        // type-coverage:ignore-next-line
        value[0] &&
        // Looks like a node.
        // type-coverage:ignore-next-line
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
      // @ts-expect-error looks like a parent node.
      (object.children && object.children.length > 0 ? dim('│') : ' ') + ' '
    )
  }

  /**
   * @param {Node} node
   * @returns {string}
   */
  function inspectTree(node) {
    const result = [formatNode(node)]
    // @ts-expect-error: looks like a record.
    const fields = inspectFields(node)
    // @ts-expect-error looks like a parent.
    const content = inspectNodes(node.children || [])
    if (fields) result.push(fields)
    if (content) result.push(content)
    return result.join('\n')
  }

  /**
   * Colored node formatter.
   *
   * @param {Node} node
   * @returns {string}
   */
  function formatNode(node) {
    const result = [bold(node.type)]
    /** @type {string|undefined} */
    // @ts-expect-error: might be available.
    const kind = node.tagName || node.name
    const position = positions ? stringifyPosition(node.position) : ''

    if (typeof kind === 'string') {
      result.push('<', kind, '>')
    }

    // @ts-expect-error: looks like a parent.
    if (node.children) {
      // @ts-expect-error looks like a parent.
      result.push(dim('['), yellow(node.children.length), dim(']'))
      // @ts-expect-error: looks like a literal.
    } else if (typeof node.value === 'string') {
      // @ts-expect-error: looks like a literal.
      result.push(' ', green(inspectNonTree(node.value)))
    }

    if (position) {
      result.push(' ', dim('('), position, dim(')'))
    }

    return result.join('')
  }
}

/**
 * @param {string} value
 * @param {string} indentation
 * @param {boolean} [ignoreFirst=false]
 * @returns {string}
 */
function indent(value, indentation, ignoreFirst) {
  const lines = value.split('\n')
  let index = ignoreFirst ? 0 : -1

  if (!value) return value

  while (++index < lines.length) {
    lines[index] = indentation + lines[index]
  }

  return lines.join('\n')
}

/**
 * @param {Position|undefined} [value]
 * @returns {string}
 */
function stringifyPosition(value) {
  /** @type {Position} */
  // @ts-expect-error: fine.
  const position = value || {}
  /** @type {Array<string>} */
  const result = []
  /** @type {Array<string>} */
  const positions = []
  /** @type {Array<string>} */
  const offsets = []

  point(position.start)
  point(position.end)

  if (positions.length > 0) result.push(positions.join('-'))
  if (offsets.length > 0) result.push(offsets.join('-'))

  return result.join(', ')

  /**
   * @param {Point} value
   */
  function point(value) {
    if (value) {
      positions.push((value.line || 1) + ':' + (value.column || 1))

      if ('offset' in value) {
        offsets.push(String(value.offset || 0))
      }
    }
  }
}

/**
 * Factory to wrap values in ANSI colours.
 *
 * @param {number} open
 * @param {number} close
 * @returns {function(string): string}
 */
function ansiColor(open, close) {
  return color

  /**
   * @param {string} value
   * @returns {string}
   */
  function color(value) {
    return '\u001B[' + open + 'm' + value + '\u001B[' + close + 'm'
  }
}
