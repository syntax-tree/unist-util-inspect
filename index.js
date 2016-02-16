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
 * @param {string} open - Opening sequence.
 * @param {string} close - Closing sequence.
 * @return {function(string): string} - Bound function.
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
 * @param {string} value - Value to strip.
 * @return {string} - Stripped value.
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

/*
 * Standard keys defined by unist:
 * https://github.com/wooorm/unist.
 * We don‘t include `data` though.
 */

var ignore = [
    'type',
    'value',
    'children',
    'position'
];

/**
 * Colored nesting formatter.
 *
 * @param {string} value - Value to format as nesting.
 * @return {string} - Formatted value.
 */
function formatNesting(value) {
    return dim(value);
}

/**
 * Compile a single position.
 *
 * @param {Object?} pos - Single position.
 * @return {Array.<string>?} - Compiled position.
 */
function compile(pos) {
    var values = [];

    if (!pos) {
        return null;
    }

    values = [
        [pos.line || 1, pos.column || 1].join(':')
    ];

    if ('offset' in pos) {
        values.push(String(pos.offset || 0));
    }

    return values;
}

/**
 * Compile a location.
 *
 * @param {Object?} start - Start position.
 * @param {Object?} end - End position.
 * @return {string} - Stringified position.
 */
function stringify(start, end) {
    var values = [];
    var positions = [];
    var offsets = [];

    /**
     * Add a position.
     *
     * @param {Position} position - Position to add.
     */
    function add(position) {
        var tuple = compile(position);

        if (tuple) {
            positions.push(tuple[0]);

            if (tuple[1]) {
                offsets.push(tuple[1]);
            }
        }
    }

    add(start);
    add(end);

    if (positions.length) {
        values.push(positions.join('-'));
    }

    if (offsets.length) {
        values.push(offsets.join('-'));
    }

    return values.join(', ');
}

/**
 * Colored node formatter.
 *
 * @param {Node} node - Node to format.
 * @return {string} - Formatted node.
 */
function formatNode(node) {
    var log = node.type;
    var location = node.position || {};
    var position = stringify(location.start, location.end);
    var key;
    var values = [];
    var value;

    if (node.children && node.children.length) {
        log += dim('[') + yellow(node.children.length) + dim(']');
    } else {
        log += dim(': ') + green(JSON.stringify(node.value));
    }

    if (position) {
        log += ' (' + position + ')';
    }

    for (key in node) {
        value = node[key];

        if (
            ignore.indexOf(key) !== -1 ||
            value === null ||
            value === undefined ||
            (typeof value === 'object' && isEmpty(value))
        ) {
            continue;
        }

        values.push('[' + key + '=' + JSON.stringify(value) + ']');
    }

    if (values.length) {
        log += ' ' + values.join('');
    }

    return log;
}

/**
 * Inspects a node.
 *
 * @param {Node} node - Node to inspect.
 * @param {string?} [pad] - Padding.
 * @return {string} - Formatted node.
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
 * @param {Node} node - Node to inspect.
 * @param {string?} [pad] - Padding.
 * @return {string} - Formatted node.
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
