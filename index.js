'use strict';

/**
 * Define `plugin`.
 */

function plugin() {}

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
    return before;
}

/**
 * Default node formatter.
 *
 * @param {Node} node
 * @return {string}
 */

function formatNode(node) {
    if ('length' in node) {
        return node.type + '[' + node.length + ']';
    }

    return node.type + ': \'' + node.toString() + '\'';
}

/**
 * Inspects a node.
 *
 * @param {Object?} options
 * @param {function(Node): string?} options.formatNode
 * @param {function(string): string?} options.formatNesting
 * @return {string}
 * @this {Node} Context to search in.
 */

function inspect(options, pad) {
    var self,
        node,
        result,
        index,
        length,
        nesting;

    if (typeof options !== 'object') {
        pad = options;
        options = {};
    }

    self = this;

    if (!('length' in self)) {
        return (options.formatNode || formatNode)(self);
    }

    if (!pad) {
        pad = '';
    }

    result = [];

    nesting = options.formatNesting || formatNesting;

    result.push((options.formatNode || formatNode)(self));

    index = -1;
    length = self.length;

    while (++index < length) {
        node = self[index];

        if (index === length - 1) {
            result.push(
                nesting(pad + STOP) + node.inspect(options, pad + '   ')
            );
        } else {
            result.push(
                nesting(pad + CONTINUE) +
                    node.inspect(options, pad + CHAR_VERTICAL_LINE + '  ')
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
