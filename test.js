/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unist:util:inspect
 * @fileoverview Test suite for `unist-util-inspect`.
 */

'use strict';

/* eslint-env node, mocha */

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
                'RootNode[1] (1:1-1:36, 0:35)',
                '└─ ParagraphNode[3] (1:1-1:36, 0:35)',
                '   ├─ SentenceNode[6] (1:1-1:18, 0:17)',
                '   │  ├─ WordNode[1] (1:1-1:5, 0:4)',
                '   │  │  └─ TextNode: "Some" (1:1-1:5, 0:4)',
                '   │  ├─ WhiteSpaceNode: " " (1:5-1:6, 4:5)',
                '   │  ├─ WordNode[1] (1:6-1:12, 5:11)',
                '   │  │  └─ TextNode: "simple" (1:6-1:12, 5:11)',
                '   │  ├─ WhiteSpaceNode: " " (1:12-1:13, 11:12)',
                '   │  ├─ WordNode[1] (1:13-1:17, 12:16)',
                '   │  │  └─ TextNode: "text" (1:13-1:17, 12:16)',
                '   │  └─ PunctuationNode: "." (1:17-1:18, 16:17)',
                '   ├─ WhiteSpaceNode: " " (1:18-1:19, 17:18)',
                '   └─ SentenceNode[6] (1:19-1:36, 18:35)',
                '      ├─ WordNode[1] (1:19-1:24, 18:23)',
                '      │  └─ TextNode: "Other" (1:19-1:24, 18:23)',
                '      ├─ WhiteSpaceNode: " " (1:24-1:25, 23:24)',
                '      ├─ PunctuationNode: "“" (1:25-1:26, 24:25)',
                '      ├─ WordNode[1] (1:26-1:34, 25:33)',
                '      │  └─ TextNode: "sentence" (1:26-1:34, 25:33)',
                '      ├─ PunctuationNode: "”" (1:34-1:35, 33:34)',
                '      └─ PunctuationNode: "." (1:35-1:36, 34:35)'
            ].join('\n')
        );
    });

    it('should work on `SentenceNode`', function () {
        equal(
            strip(inspect(tree.children[0].children[0])),
            [
                'SentenceNode[6] (1:1-1:18, 0:17)',
                '├─ WordNode[1] (1:1-1:5, 0:4)',
                '│  └─ TextNode: "Some" (1:1-1:5, 0:4)',
                '├─ WhiteSpaceNode: " " (1:5-1:6, 4:5)',
                '├─ WordNode[1] (1:6-1:12, 5:11)',
                '│  └─ TextNode: "simple" (1:6-1:12, 5:11)',
                '├─ WhiteSpaceNode: " " (1:12-1:13, 11:12)',
                '├─ WordNode[1] (1:13-1:17, 12:16)',
                '│  └─ TextNode: "text" (1:13-1:17, 12:16)',
                '└─ PunctuationNode: "." (1:17-1:18, 16:17)'
            ].join('\n')
        );
    });

    it('should work with a list of nodes', function () {
        equal(strip(inspect([
            {
                'type': 'SymbolNode',
                'value': '$'
            },
            {
                'type': 'WordNode',
                'children': [{
                    'type': 'text',
                    'value': '5,00'
                }]
            }
        ])), [
            'SymbolNode: "$"',
            'WordNode[1]',
            '└─ text: "5,00"'
        ].join('\n'));
    });

    it('should work on non-nodes', function () {
        equal(strip(inspect('foo')), 'foo');
        equal(strip(inspect('null')), 'null');
        equal(strip(inspect(NaN)), 'NaN');
        equal(strip(inspect(3)), '3');
    });

    it('should work with data attributes', function () {
        equal(strip(inspect({
            'type': 'SymbolNode',
            'value': '$',
            'data': {
                'test': true
            }
        })), 'SymbolNode: "$" [data={"test":true}]');
    });
});

describe('inspect.noColor()', function () {
    it('should work', function () {
        var sentence = retext().parse(paragraph).children[0].children[0];

        equal(inspect.noColor(sentence), [
            'SentenceNode[6] (1:1-1:18, 0:17)',
            '├─ WordNode[1] (1:1-1:5, 0:4)',
            '│  └─ TextNode: "Some" (1:1-1:5, 0:4)',
            '├─ WhiteSpaceNode: " " (1:5-1:6, 4:5)',
            '├─ WordNode[1] (1:6-1:12, 5:11)',
            '│  └─ TextNode: "simple" (1:6-1:12, 5:11)',
            '├─ WhiteSpaceNode: " " (1:12-1:13, 11:12)',
            '├─ WordNode[1] (1:13-1:17, 12:16)',
            '│  └─ TextNode: "text" (1:13-1:17, 12:16)',
            '└─ PunctuationNode: "." (1:17-1:18, 16:17)'
        ].join('\n'));
    });
});

describe('inspect.color()', function () {
    it('should work', function () {
        var sentence = retext().parse(paragraph).children[0].children[0];

        equal(inspect.color(sentence), [
            'SentenceNode' +
                chalk.dim('[') + chalk.yellow('6') + chalk.dim(']') + ' (1:1-1:18, 0:17)',
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']') + ' (1:1-1:5, 0:4)',
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': ') + chalk.green('"Some"') + ' (1:1-1:5, 0:4)',
            chalk.dim('├─ ') + 'WhiteSpaceNode' +
                chalk.dim(': ') + chalk.green('" "') + ' (1:5-1:6, 4:5)',
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']') + ' (1:6-1:12, 5:11)',
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': ') + chalk.green('"simple"') + ' (1:6-1:12, 5:11)',
            chalk.dim('├─ ') + 'WhiteSpaceNode' +
                chalk.dim(': ') + chalk.green('" "') + ' (1:12-1:13, 11:12)',
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']') + ' (1:13-1:17, 12:16)',
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': ') + chalk.green('"text"') + ' (1:13-1:17, 12:16)',
            chalk.dim('└─ ') + 'PunctuationNode' +
                chalk.dim(': ') + chalk.green('"."') + ' (1:17-1:18, 16:17)'
        ].join('\n'));
    });
});
