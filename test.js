'use strict';

var inspect,
    chalk,
    Retext,
    assert,
    util;

/*
 * Module dependencies.
 */

inspect = require('./');
chalk = require('chalk');
Retext = require('retext');
assert = require('assert');
util = require('util');

/**
 * Intercept stdout.
 *
 * @param {function(string)} callback
 * @return {Function} A method to stop intercepting.
 */
function intercept(callback) {
    var write;

    write = process.stdout.write;

    process.stdout.write = callback;

    return function () {
        process.stdout.write = write;
    };
}

/*
 * Fixtures.
 */

var paragraph;

paragraph = 'Some simple text. Other “sentence”.';

/*
 * Retext.
 */

var retextWithColor,
    retextWithoutColor,
    TextOM;

retextWithColor = new Retext().use(inspect);
retextWithoutColor = new Retext().use(inspect, {
    'color': false
});

TextOM = retextWithColor.TextOM;

/*
 * Tests.
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
        assert(typeof (new TextOM.SymbolNode()).inspect === 'function');
        assert(typeof (new TextOM.PunctuationNode()).inspect === 'function');
        assert(typeof (new TextOM.WhiteSpaceNode()).inspect === 'function');
        assert(typeof (new TextOM.TextNode()).inspect === 'function');
        assert(typeof (new TextOM.SourceNode()).inspect === 'function');
    });
});

/*
 * Unit tests for `Node#inspect()`.
 */

describe('inspect()', function () {
    var tree;

    before(function (done) {
        retextWithColor.parse(paragraph, function (err, node) {
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
        ].join('\n');

        assert(chalk.stripColor(tree.inspect()) === fixture);
    });

    it('should work on `SentenceNode`', function () {
        var fixture;

        fixture = [
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
        ].join('\n');

        assert(chalk.stripColor(tree.head.head.inspect()) === fixture);
    });

    it('should work with data attributes', function () {
        var text,
            fixture;

        text = new TextOM.SymbolNode('$');

        text.data.test = true;

        fixture = 'SymbolNode: \'$\' [data={"test":true}]';

        assert(chalk.stripColor(text.inspect()) === fixture);
    });
});

describe('use(inspect, {color: false})', function () {
    var sentence;

    before(function (done) {
        retextWithoutColor.parse(paragraph, function (err, tree) {
            sentence = tree.head.head;

            done(err);
        });
    });

    it('should work', function () {
        var fixture;

        fixture = [
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
        ].join('\n');

        assert(sentence.inspect() === fixture);
    });
});

describe('use(inspect, {color: true})', function () {
    var sentence;

    before(function (done) {
        retextWithColor.parse(paragraph, function (err, tree) {
            sentence = tree.head.head;

            done(err);
        });
    });

    it('should work', function () {
        var fixture;

        fixture = [
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
        ].join('\n');

        assert(sentence.inspect() === fixture);
    });
});

/*
 * Unit tests for Node.js integration.
 */

describe('`util.inspect` and `console.log` integration', function () {
    var tree;

    before(function (done) {
        retextWithColor.parse(paragraph, function (err, node) {
            tree = node;

            done(err);
        });
    });

    it('should work with `util.inspect`', function () {
        var fixture;

        fixture = [
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
        ].join('\n');

        assert(chalk.stripColor(util.inspect(tree)) === fixture);
    });

    it('should work with `console.log`', function (done) {
        var fixture,
            stop;

        fixture = [
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
        ].join('\n');

        stop = intercept(function (value) {
            stop();

            assert(chalk.stripColor(value) === fixture + '\n');

            done();
        });

        console.log(tree);
    });
});
