'use strict';

var Retext,
    inspect;

/**
 * Dependencies.
 */

Retext = require('retext');
inspect = require('./');

/**
 * Dependencies.
 */

var retext;

retext = new Retext().use(inspect);

/**
 * Test data.
 *
 * This includes:
 *
 * - An average sentence (w/ 20 words);
 * - An average paragraph (w/ 5 sentences);
 * - A (big?) section (w/ 10 paragraphs);
 * - A (big?) article (w/ 10 sections);
 *
 * Source:
 *   http://www.gutenberg.org/files/10745/10745-h/10745-h.htm
 */

var sentence,
    paragraph,
    section,
    article;

sentence = 'Where she had stood was clear, and she was gone since Sir ' +
    'Kay does not choose to assume my quarrel.';

paragraph = 'Thou art a churlish knight to so affront a lady ' +
    'he could not sit upon his horse any longer. ' +
    'For methinks something hath befallen my lord and that he ' +
    'then, after a while, he cried out in great voice. ' +
    'For that light in the sky lieth in the south ' +
    'then Queen Helen fell down in a swoon, and lay. ' +
    'Touch me not, for I am not mortal, but Fay ' +
    'so the Lady of the Lake vanished away, everything behind. ' +
    sentence;

section = paragraph + Array(10).join('\n\n' + paragraph);

article = section + Array(10).join('\n\n' + section);

before(function (done) {
    retext.parse(paragraph, function (err, tree) {
        paragraph = tree;

        done(err);
    });
});

before(function (done) {
    retext.parse(section, function (err, tree) {
        section = tree;

        done(err);
    });
});

before(function (done) {
    retext.parse(article, function (err, tree) {
        article = tree;

        done(err);
    });
});

suite('TextOM.Node#inspect()', function () {
    bench('A paragraph (5 sentences, 100 words)', function () {
        paragraph.inspect();
    });

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function () {
            section.inspect();
        }
    );

    bench('An article (100 paragraphs, 500 sentences, 10,000 words)',
        function () {
            article.inspect();
        }
    );
});
