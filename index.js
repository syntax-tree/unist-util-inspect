/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unist:util:inspect
 * @fileoverview Unist node inspector.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var isEmpty = require('is-empty');

/*
 * Define ANSII color functions.
 */

/**
 * Factory to wrap values in ANSI colours.
 *
 * @param {string} open
 * @param {string} close
 * @return {function(string): string}
 */
function ansiColor(open, close) {
    return function (value) {
        return '\u001b[' + open + 'm' + value + '\u001b[' + close + 'm';
    };
}

var dim = ansiColor(2, 22);
var yellow = ansiColor(33, 39);
var green = ansiColor(32, 39);

/*
 * Define ANSII color removal functionality.
 */

var COLOR_EXPRESSION = new RegExp(
    '(?:' +
        '(?:\\u001b\\[)|' +
        '\\u009b' +
    ')' +
    '(?:' +
        '(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m]' +
    ')|' +
    '\\u001b[A-M]',
    'g'
);

/**
 * Remove ANSI colour from `value`.
 *
 * @param {string} value
 * @return {string}
 */
function stripColor(value) {
    return value.replace(COLOR_EXPRESSION, '');
}

/*
 * Define constants characters.
 */

var CHAR_HORIZONTAL_LINE = '─';
var CHAR_VERTICAL_LINE = '│';
var CHAR_SPLIT = '└';
var CHAR_CONTINUE_AND_SPLIT = '├';
var CONTINUE = CHAR_CONTINUE_AND_SPLIT + CHAR_HORIZONTAL_LINE + ' ';
var STOP = CHAR_SPLIT + CHAR_HORIZONTAL_LINE + ' ';

/**
 * Colored nesting formatter.
 *
 * @param {string} value
 * @return {string}
 */
function formatNesting(value) {
    return dim(value);
}

/**
 * Colored node formatter.
 *
 * @param {Node} node
 * @return {string}
 */
function formatNode(node) {
    var log = node.type;

    if (node.children && node.children.length) {
        log += dim('[') + yellow(node.children.length) + dim(']');
    } else {
        log += dim(': ') + green(JSON.stringify(node.value));
    }

    if (!isEmpty(node.position)) {
        log += ' (' + node.position.start.line + ':' + node.position.start.column +
            '-' + node.position.end.line + ':' + node.position.end.column +
            ', ' + node.position.start.offset + ':' + node.position.end.offset + ')';
    }

    if (!isEmpty(node.data)) {
        log += ' [data=' + JSON.stringify(node.data) + ']';
    }

    return log;
}

/**
 * Inspects a node.
 *
 * @this {Node}
 * @return {string}
 */
function inspect(node, pad) {
    var result;
    var children;
    var index;
    var length;

    if (node && node.length && typeof node !== 'string') {
        length = node.length;
        index = -1;
        result = [];

        while (++index < length) {
            result[index] = inspect(node[index]);
        }

        return result.join('\n');
    }

    if (!node || !node.type) {
        return String(node);
    }

    result = [formatNode(node)];
    children = node.children;
    length = children && children.length;
    index = -1;

    if (!length) {
        return result[0];
    }

    if (!pad || typeof pad === 'number') {
        pad = '';
    }

    while (++index < length) {
        node = children[index];

        if (index === length - 1) {
            result.push(
                formatNesting(pad + STOP) + inspect(node, pad + '   ')
            );
        } else {
            result.push(
                formatNesting(pad + CONTINUE) +
                inspect(node, pad + CHAR_VERTICAL_LINE + '  ')
            );
        }
    }

    return result.join('\n');
}

/**
 * Inspects a node, without using color.
 *
 * @return {string}
 * @this {Node}
 */
function noColor(node, pad) {
    return stripColor(inspect(node, pad));
}

/*
 * Detect.
 */

var color = true;

try {
    color = 'inspect' in require('util');
} catch (exception) {
    /* istanbul ignore next - browser */
    color = false;
}

/*
 * Expose.
 */

inspect.color = noColor.color = inspect;
inspect.noColor = noColor.noColor = noColor;

/*
 * Expose.
 */

module.exports = color ? inspect : /* istanbul ignore next */ noColor;
