'use strict';

/*
 * Cached methods.
 */

var has;

has = Object.prototype.hasOwnProperty;

/**
 * Get whether `object` has keys.
 *
 * @param {Object} object
 * @return {boolean}
 */
function hasKeys(object) {
    var key;

    for (key in object) {
        /* istanbul ignore else */
        if (has.call(object, key)) {
            return true;
        }
    }

    return false;
}

/*
 * Define ANSII color functions.
 */

var dim,
    yellow,
    green;

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

dim = ansiColor(2, 22);
yellow = ansiColor(33, 39);
green = ansiColor(32, 39);

/*
 * Define ANSII color removal functionality.
 */

var COLOR_EXPRESSION;

COLOR_EXPRESSION = new RegExp(
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

var CHAR_VERTICAL_LINE,
    CHAR_HORIZONTAL_LINE,
    CHAR_SPLIT,
    CHAR_CONTINUE_AND_SPLIT,
    CONTINUE,
    STOP;

CHAR_HORIZONTAL_LINE = '─';
CHAR_VERTICAL_LINE = '│';
CHAR_SPLIT = '└';
CHAR_CONTINUE_AND_SPLIT = '├';

CONTINUE = CHAR_CONTINUE_AND_SPLIT + CHAR_HORIZONTAL_LINE + ' ';
STOP = CHAR_SPLIT + CHAR_HORIZONTAL_LINE + ' ';

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
    var log;

    log = node.type;

    if ('length' in node) {
        log += dim('[') + yellow(node.length) + dim(']');
    } else {
        log += dim(': \'') + green(node.toString()) + dim('\'');
    }

    if (hasKeys(node.data)) {
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
function inspect(pad) {
    var self,
        node,
        result,
        index,
        length;

    self = this;

    if (!('length' in self)) {
        return formatNode(self);
    }

    if (!pad || typeof pad === 'number') {
        pad = '';
    }

    result = [];

    result.push(formatNode(self));

    index = -1;
    length = self.length;

    while (++index < length) {
        node = self[index];

        if (index === length - 1) {
            result.push(
                formatNesting(pad + STOP) + node.inspect(pad + '   ')
            );
        } else {
            result.push(
                formatNesting(pad + CONTINUE) +
                    node.inspect(pad + CHAR_VERTICAL_LINE + '  ')
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
function inspectWithoutColor(pad) {
    return stripColor(inspect.call(this, pad));
}

/**
 * Define `plugin`.
 *
 * @param {Retext} retext
 */
function plugin(retext, options) {
    var color;

    color = options.color;

    if (typeof color !== 'boolean') {
        /*
         * Detect if the client has a native `util.inspect`.
         * If so, turn `color` on.
         */

        try {
            color = 'inspect' in require('util');
        } catch (exception) {
            /* istanbul ignore next */
            color = false;
        }
    }

    /*
     * Expose `inspect` on `Node`s.
     */

    retext.TextOM.Node.prototype.inspect = color ?
        inspect : inspectWithoutColor;
}

/*
 * Expose `plugin`.
 */

exports = module.exports = plugin;
