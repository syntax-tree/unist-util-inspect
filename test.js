'use strict';

/* eslint-env mocha */

/*
 * Module dependencies.
 */

var assert = require('assert');
var chalk = require('chalk');
var retext = require('retext');
var inspect = require('./');

/*
 * Methods.
 */

var strip = chalk.stripColor;
var equal = assert.equal;

/*
 * Fixtures.
 */

var paragraph = 'Some simple text. Other “sentence”.';

/*
 * Tests.
 */

describe('inspect', function () {
    it('should be a `function`', function () {
        equal(typeof inspect, 'function');
    });

    it('should have `color` and `noColor` properties', function () {
        equal(typeof inspect.color, 'function');
        equal(typeof inspect.noColor, 'function');

        equal(typeof inspect.color.noColor, 'function');
        equal(typeof inspect.noColor.color, 'function');
    });
});

/*
 * Unit tests for `Node#inspect()`.
 */

describe('inspect()', function () {
    var tree;

    before(function () {
        tree = retext().parse(paragraph);
    });

    it('should work on `RootNode`', function () {
        equal(
            strip(inspect(tree)),
            [
                'RootNode[1]',
                '└─ ParagraphNode[3]',
                '   ├─ SentenceNode[6]',
                '   │  ├─ WordNode[1]',
                '   │  │  └─ TextNode: \'Some\'',
                '   │  ├─ WhiteSpaceNode: \' \'',
                '   │  ├─ WordNode[1]',
                '   │  │  └─ TextNode: \'simple\'',
                '   │  ├─ WhiteSpaceNode: \' \'',
                '   │  ├─ WordNode[1]',
                '   │  │  └─ TextNode: \'text\'',
                '   │  └─ PunctuationNode: \'.\'',
                '   ├─ WhiteSpaceNode: \' \'',
                '   └─ SentenceNode[6]',
                '      ├─ WordNode[1]',
                '      │  └─ TextNode: \'Other\'',
                '      ├─ WhiteSpaceNode: \' \'',
                '      ├─ PunctuationNode: \'“\'',
                '      ├─ WordNode[1]',
                '      │  └─ TextNode: \'sentence\'',
                '      ├─ PunctuationNode: \'”\'',
                '      └─ PunctuationNode: \'.\''
            ].join('\n')
        );
    });

    it('should work on `SentenceNode`', function () {
        equal(
            strip(inspect(tree.children[0].children[0])),
            [
                'SentenceNode[6]',
                '├─ WordNode[1]',
                '│  └─ TextNode: \'Some\'',
                '├─ WhiteSpaceNode: \' \'',
                '├─ WordNode[1]',
                '│  └─ TextNode: \'simple\'',
                '├─ WhiteSpaceNode: \' \'',
                '├─ WordNode[1]',
                '│  └─ TextNode: \'text\'',
                '└─ PunctuationNode: \'.\''
            ].join('\n')
        );
    });

    it('should work with data attributes', function () {
        equal(strip(inspect({
            'type': 'SymbolNode',
            'value': '$',
            'data': {
                'test': true
            }
        })), 'SymbolNode: \'$\' [data={"test":true}]');
    });
});

describe('inspect.noColor()', function () {
    it('should work', function () {
        var sentence = retext().parse(paragraph).children[0].children[0];

        equal(inspect.noColor(sentence), [
            'SentenceNode[6]',
            '├─ WordNode[1]',
            '│  └─ TextNode: \'Some\'',
            '├─ WhiteSpaceNode: \' \'',
            '├─ WordNode[1]',
            '│  └─ TextNode: \'simple\'',
            '├─ WhiteSpaceNode: \' \'',
            '├─ WordNode[1]',
            '│  └─ TextNode: \'text\'',
            '└─ PunctuationNode: \'.\''
        ].join('\n'));
    });
});

describe('inspect.color()', function () {
    it('should work', function () {
        var sentence = retext().parse(paragraph).children[0].children[0];

        equal(inspect.color(sentence), [
            'SentenceNode' +
                chalk.dim('[') + chalk.yellow('6') + chalk.dim(']'),
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']'),
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': \'') + chalk.green('Some') + chalk.dim('\''),
            chalk.dim('├─ ') + 'WhiteSpaceNode' +
                chalk.dim(': \'') + chalk.green(' ') + chalk.dim('\''),
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']'),
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': \'') + chalk.green('simple') + chalk.dim('\''),
            chalk.dim('├─ ') + 'WhiteSpaceNode' +
                chalk.dim(': \'') + chalk.green(' ') + chalk.dim('\''),
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']'),
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': \'') + chalk.green('text') + chalk.dim('\''),
            chalk.dim('└─ ') + 'PunctuationNode' +
                chalk.dim(': \'') + chalk.green('.') + chalk.dim('\'')
        ].join('\n'));
    });
});
