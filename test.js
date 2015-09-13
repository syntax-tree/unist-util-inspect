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
                'RootNode[1] (start={l:1, c:1, o:0}, end={l:1, c:36, o:35})',
                '└─ ParagraphNode[3] (start={l:1, c:1, o:0}, end={l:1, c:36, o:35})',
                '   ├─ SentenceNode[6] (start={l:1, c:1, o:0}, end={l:1, c:18, o:17})',
                '   │  ├─ WordNode[1] (start={l:1, c:1, o:0}, end={l:1, c:5, o:4})',
                '   │  │  └─ TextNode: "Some" (start={l:1, c:1, o:0}, end={l:1, c:5, o:4})',
                '   │  ├─ WhiteSpaceNode: " " (start={l:1, c:5, o:4}, end={l:1, c:6, o:5})',
                '   │  ├─ WordNode[1] (start={l:1, c:6, o:5}, end={l:1, c:12, o:11})',
                '   │  │  └─ TextNode: "simple" (start={l:1, c:6, o:5}, end={l:1, c:12, o:11})',
                '   │  ├─ WhiteSpaceNode: " " (start={l:1, c:12, o:11}, end={l:1, c:13, o:12})',
                '   │  ├─ WordNode[1] (start={l:1, c:13, o:12}, end={l:1, c:17, o:16})',
                '   │  │  └─ TextNode: "text" (start={l:1, c:13, o:12}, end={l:1, c:17, o:16})',
                '   │  └─ PunctuationNode: "." (start={l:1, c:17, o:16}, end={l:1, c:18, o:17})',
                '   ├─ WhiteSpaceNode: " " (start={l:1, c:18, o:17}, end={l:1, c:19, o:18})',
                '   └─ SentenceNode[6] (start={l:1, c:19, o:18}, end={l:1, c:36, o:35})',
                '      ├─ WordNode[1] (start={l:1, c:19, o:18}, end={l:1, c:24, o:23})',
                '      │  └─ TextNode: "Other" (start={l:1, c:19, o:18}, end={l:1, c:24, o:23})',
                '      ├─ WhiteSpaceNode: " " (start={l:1, c:24, o:23}, end={l:1, c:25, o:24})',
                '      ├─ PunctuationNode: "“" (start={l:1, c:25, o:24}, end={l:1, c:26, o:25})',
                '      ├─ WordNode[1] (start={l:1, c:26, o:25}, end={l:1, c:34, o:33})',
                '      │  └─ TextNode: "sentence" (start={l:1, c:26, o:25}, end={l:1, c:34, o:33})',
                '      ├─ PunctuationNode: "”" (start={l:1, c:34, o:33}, end={l:1, c:35, o:34})',
                '      └─ PunctuationNode: "." (start={l:1, c:35, o:34}, end={l:1, c:36, o:35})'
            ].join('\n')
        );
    });

    it('should work on `SentenceNode`', function () {
        equal(
            strip(inspect(tree.children[0].children[0])),
            [
                'SentenceNode[6] (start={l:1, c:1, o:0}, end={l:1, c:18, o:17})',
                '├─ WordNode[1] (start={l:1, c:1, o:0}, end={l:1, c:5, o:4})',
                '│  └─ TextNode: "Some" (start={l:1, c:1, o:0}, end={l:1, c:5, o:4})',
                '├─ WhiteSpaceNode: " " (start={l:1, c:5, o:4}, end={l:1, c:6, o:5})',
                '├─ WordNode[1] (start={l:1, c:6, o:5}, end={l:1, c:12, o:11})',
                '│  └─ TextNode: "simple" (start={l:1, c:6, o:5}, end={l:1, c:12, o:11})',
                '├─ WhiteSpaceNode: " " (start={l:1, c:12, o:11}, end={l:1, c:13, o:12})',
                '├─ WordNode[1] (start={l:1, c:13, o:12}, end={l:1, c:17, o:16})',
                '│  └─ TextNode: "text" (start={l:1, c:13, o:12}, end={l:1, c:17, o:16})',
                '└─ PunctuationNode: "." (start={l:1, c:17, o:16}, end={l:1, c:18, o:17})'
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
            'SentenceNode[6] (start={l:1, c:1, o:0}, end={l:1, c:18, o:17})',
            '├─ WordNode[1] (start={l:1, c:1, o:0}, end={l:1, c:5, o:4})',
            '│  └─ TextNode: "Some" (start={l:1, c:1, o:0}, end={l:1, c:5, o:4})',
            '├─ WhiteSpaceNode: " " (start={l:1, c:5, o:4}, end={l:1, c:6, o:5})',
            '├─ WordNode[1] (start={l:1, c:6, o:5}, end={l:1, c:12, o:11})',
            '│  └─ TextNode: "simple" (start={l:1, c:6, o:5}, end={l:1, c:12, o:11})',
            '├─ WhiteSpaceNode: " " (start={l:1, c:12, o:11}, end={l:1, c:13, o:12})',
            '├─ WordNode[1] (start={l:1, c:13, o:12}, end={l:1, c:17, o:16})',
            '│  └─ TextNode: "text" (start={l:1, c:13, o:12}, end={l:1, c:17, o:16})',
            '└─ PunctuationNode: "." (start={l:1, c:17, o:16}, end={l:1, c:18, o:17})'
        ].join('\n'));
    });
});

describe('inspect.color()', function () {
    it('should work', function () {
        var sentence = retext().parse(paragraph).children[0].children[0];

        equal(inspect.color(sentence), [
            'SentenceNode' +
                chalk.dim('[') + chalk.yellow('6') + chalk.dim(']') + ' (start={l:1, c:1, o:0}, end={l:1, c:18, o:17})',
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']') + ' (start={l:1, c:1, o:0}, end={l:1, c:5, o:4})',
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': ') + chalk.green('"Some"') + ' (start={l:1, c:1, o:0}, end={l:1, c:5, o:4})',
            chalk.dim('├─ ') + 'WhiteSpaceNode' +
                chalk.dim(': ') + chalk.green('" "') + ' (start={l:1, c:5, o:4}, end={l:1, c:6, o:5})',
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']') + ' (start={l:1, c:6, o:5}, end={l:1, c:12, o:11})',
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': ') + chalk.green('"simple"') + ' (start={l:1, c:6, o:5}, end={l:1, c:12, o:11})',
            chalk.dim('├─ ') + 'WhiteSpaceNode' +
                chalk.dim(': ') + chalk.green('" "') + ' (start={l:1, c:12, o:11}, end={l:1, c:13, o:12})',
            chalk.dim('├─ ') + 'WordNode' +
                chalk.dim('[') + chalk.yellow('1') + chalk.dim(']') + ' (start={l:1, c:13, o:12}, end={l:1, c:17, o:16})',
            chalk.dim('│  └─ ') + 'TextNode' +
                chalk.dim(': ') + chalk.green('"text"') + ' (start={l:1, c:13, o:12}, end={l:1, c:17, o:16})',
            chalk.dim('└─ ') + 'PunctuationNode' +
                chalk.dim(': ') + chalk.green('"."') + ' (start={l:1, c:17, o:16}, end={l:1, c:18, o:17})'
        ].join('\n'));
    });
});
