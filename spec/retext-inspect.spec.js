'use strict';

var inspect,
    chalk,
    Retext,
    assert,
    retext,
    TextOM,
    paragraph;

/**
 * Module dependencies.
 */

inspect = require('..');
Retext = require('retext');
chalk = require('chalk');
assert = require('assert');

/**
 * Format nesting.
 *
 * @param {string} nesting
 * @return {string}
 */

function formatNesting(nesting) {
    return chalk.dim(nesting);
}

/**
 * Format node.
 *
 * @param {Node} node
 * @return {string}
 */

function formatNode(node) {
    if ('length' in node) {
        return node.type + '[' + chalk.yellow(node.length) + ']';
    }

    return node.type + ': ' + chalk.green('\'' + node.toString() + '\'');
}

/**
 * Constants.
 */

paragraph = 'Some simple text. Other “sentence”.';

retext = new Retext().use(inspect);
TextOM = retext.TextOM;

/**
 * Unit tests.
 */

describe('retext-inspect()', function () {
    it('should be a `function`', function () {
        assert(typeof inspect === 'function');
    });

    it('should attach an `inspect` method to `Node#`', function () {
        assert(typeof (new TextOM.Parent()).inspect === 'function');
        assert(typeof (new TextOM.Child()).inspect === 'function');
        assert(typeof (new TextOM.Element()).inspect === 'function');
        assert(typeof (new TextOM.Text()).inspect === 'function');
        assert(typeof (new TextOM.RootNode()).inspect === 'function');
        assert(typeof (new TextOM.ParagraphNode()).inspect === 'function');
        assert(typeof (new TextOM.SentenceNode()).inspect === 'function');
        assert(typeof (new TextOM.WordNode()).inspect === 'function');
        assert(typeof (new TextOM.WhiteSpaceNode()).inspect === 'function');
        assert(typeof (new TextOM.PunctuationNode()).inspect === 'function');
        assert(typeof (new TextOM.TextNode()).inspect === 'function');
        assert(typeof (new TextOM.SourceNode()).inspect === 'function');
    });
});

/**
 * Unit tests for `Node#inspect()`.
 */

describe('inspect()', function () {
    var tree;

    before(function (done) {
        retext.parse(paragraph, function (err, node) {
            tree = node;

            done(err);
        });
    });

    it('should work on `RootNode`', function () {
        var fixture;

        fixture = [
            'RootNode[1]',
            '└─ ParagraphNode[3]',
            '   ├─ SentenceNode[6]',
            '   │  ├─ WordNode[1]',
            '   │  │  └─ TextNode: \'Some\'',
            '   │  ├─ WhiteSpaceNode[1]',
            '   │  │  └─ TextNode: \' \'',
            '   │  ├─ WordNode[1]',
            '   │  │  └─ TextNode: \'simple\'',
            '   │  ├─ WhiteSpaceNode[1]',
            '   │  │  └─ TextNode: \' \'',
            '   │  ├─ WordNode[1]',
            '   │  │  └─ TextNode: \'text\'',
            '   │  └─ PunctuationNode[1]',
            '   │     └─ TextNode: \'.\'',
            '   ├─ WhiteSpaceNode[1]',
            '   │  └─ TextNode: \' \'',
            '   └─ SentenceNode[6]',
            '      ├─ WordNode[1]',
            '      │  └─ TextNode: \'Other\'',
            '      ├─ WhiteSpaceNode[1]',
            '      │  └─ TextNode: \' \'',
            '      ├─ PunctuationNode[1]',
            '      │  └─ TextNode: \'“\'',
            '      ├─ WordNode[1]',
            '      │  └─ TextNode: \'sentence\'',
            '      ├─ PunctuationNode[1]',
            '      │  └─ TextNode: \'”\'',
            '      └─ PunctuationNode[1]',
            '         └─ TextNode: \'.\''
        ].join('\n');

        assert(tree.inspect() === fixture);
    });

    it('should work on `SentenceNode`', function () {
        var fixture;

        fixture = [
            'SentenceNode[6]',
            '├─ WordNode[1]',
            '│  └─ TextNode: \'Some\'',
            '├─ WhiteSpaceNode[1]',
            '│  └─ TextNode: \' \'',
            '├─ WordNode[1]',
            '│  └─ TextNode: \'simple\'',
            '├─ WhiteSpaceNode[1]',
            '│  └─ TextNode: \' \'',
            '├─ WordNode[1]',
            '│  └─ TextNode: \'text\'',
            '└─ PunctuationNode[1]',
            '   └─ TextNode: \'.\''
        ].join('\n');

        assert(tree.head.head.inspect() === fixture);
    });
});

describe('inspect({formatNesting: function(nesting)})', function () {
    var sentence;

    before(function (done) {
        retext.parse(paragraph, function (err, tree) {
            sentence = tree.head.head;

            done(err);
        });
    });

    it('should work', function () {
        var fixture;

        fixture = [
            'SentenceNode[6]',
            chalk.dim('├─ ') + 'WordNode[1]',
            chalk.dim('│  └─ ') + 'TextNode: \'Some\'',
            chalk.dim('├─ ') + 'WhiteSpaceNode[1]',
            chalk.dim('│  └─ ') + 'TextNode: \' \'',
            chalk.dim('├─ ') + 'WordNode[1]',
            chalk.dim('│  └─ ') + 'TextNode: \'simple\'',
            chalk.dim('├─ ') + 'WhiteSpaceNode[1]',
            chalk.dim('│  └─ ') + 'TextNode: \' \'',
            chalk.dim('├─ ') + 'WordNode[1]',
            chalk.dim('│  └─ ') + 'TextNode: \'text\'',
            chalk.dim('└─ ') + 'PunctuationNode[1]',
            chalk.dim('   └─ ') + 'TextNode: \'.\''
        ].join('\n');

        assert(sentence.inspect({
            'formatNesting' : formatNesting
        }) === fixture);
    });
});

describe('inspect({formatNode: function(node)})', function () {
    var sentence;

    before(function (done) {
        retext.parse(paragraph, function (err, tree) {
            sentence = tree.head.head;

            done(err);
        });
    });

    it('should work', function () {
        var fixture;

        fixture = [
            'SentenceNode[' + chalk.yellow(6) + ']',
            '├─ WordNode[' + chalk.yellow(1) + ']',
            '│  └─ TextNode: ' + chalk.green('\'Some\''),
            '├─ WhiteSpaceNode[' + chalk.yellow(1) + ']',
            '│  └─ TextNode: ' + chalk.green('\' \''),
            '├─ WordNode[' + chalk.yellow(1) + ']',
            '│  └─ TextNode: ' + chalk.green('\'simple\''),
            '├─ WhiteSpaceNode[' + chalk.yellow(1) + ']',
            '│  └─ TextNode: ' + chalk.green('\' \''),
            '├─ WordNode[' + chalk.yellow(1) + ']',
            '│  └─ TextNode: ' + chalk.green('\'text\''),
            '└─ PunctuationNode[' + chalk.yellow(1) + ']',
            '   └─ TextNode: ' + chalk.green('\'.\'')
        ].join('\n');

        assert(sentence.inspect({
            'formatNode' : formatNode
        }) === fixture);
    });
});
