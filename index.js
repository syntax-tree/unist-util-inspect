'use strict';

/**
 * Define `plugin`.
 */

function plugin() {}

/**
 * Detect if the client has a native `util.inspect`.
 * If so, turn `color` on.
 */

plugin.color = false;

try {
    plugin.color = 'inspect' in require('util');
} catch (exception) {}

/**
 * Define ANSII color functions.
 */

var dim,
    yellow,
    green;

function color(open, close) {
    return function (value) {
        if (!plugin.color) {
            return value;
        }

        return '\u001b[' + open + 'm' + value + '\u001b[' + close + 'm';
    };
}

dim = color(2, 22);
yellow = color(33, 39);
green = color(32, 39);

/**
 * Define characters.
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
 * Default nesting formatter.
 *
 * @param {string} before
 * @return {string}
 */

function formatNesting(before) {
    return dim(before);
}

/**
 * Default node formatter.
 *
 * @param {Node} node
 * @return {string}
 */

function formatNode(node) {
    if ('length' in node) {
        return node.type + dim('[') + yellow(node.length) + dim(']');
    }

    return node.type + dim(': \'') + green(node.toString()) + dim('\'');
}

/**
 * Inspects a node.
 *
 * @return {string}
 * @this {Node}
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
 * Define `attach`.
 *
 * @param {Retext} retext
 */

function attach(retext) {
    /**
     * Expose `inspect` on `Node`s.
     */

    retext.TextOM.Node.prototype.inspect = inspect;
}

/**
 * Expose `attach`.
 */

plugin.attach = attach;

/**
 * Expose `plugin`.
 */

exports = module.exports = plugin;
