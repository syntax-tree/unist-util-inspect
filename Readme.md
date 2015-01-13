# retext-inspect [![Build Status](https://img.shields.io/travis/wooorm/retext-inspect.svg?style=flat)](https://travis-ci.org/wooorm/retext-inspect) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-inspect.svg?style=flat)](https://coveralls.io/r/wooorm/retext-inspect?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** node inspector.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install retext-inspect
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/retext-inspect
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install retext-inspect
```

[Duo](http://duojs.org/#getting-started):

```javascript
var inspect = require('wooorm/retext-inspect');
```

## Usage

```javascript
var Retext = require('retext');
var inspect = require('retext-inspect');

var retext = new Retext().use(inspect);

retext.parse('Some simple text.', function (err, tree) {
    /* Inspect a node: */
    console.log(tree.head.head.tail.inspect());
    /*
     * Logs:
     *
     * PunctuationNode[1]
     * └─ TextNode: '.'
     */

    /* Inspect a node in Node.js: */
    console.log(tree);
    /*
     * Logs:
     *
     * RootNode[1]
     * └─ ParagraphNode[1]
     *    └─ SentenceNode[6]
     *       ├─ WordNode[1]
     *       │  └─ TextNode: 'Some'
     *       ├─ WhiteSpaceNode[1]
     *       │  └─ TextNode: ' '
     *       ├─ WordNode[1]
     *       │  └─ TextNode: 'simple'
     *       ├─ WhiteSpaceNode[1]
     *       │  └─ TextNode: ' '
     *       ├─ WordNode[1]
     *       │  └─ TextNode: 'text'
     *       └─ PunctuationNode[1]
     *          └─ TextNode: '.'
     */
});
```

## API

### [Retext#use](https://github.com/wooorm/retext#retextuseplugin-options)(inspect, options?)

```javascript
retext = new Retext().use(inspect, {
    'color': false
});
```

Options:

- `color` (`boolean`, default `true`) - The diagram returned by `inspect` uses color to make things more awesome. Support is detected by checking if a `util.inspect()` exists (it does in Node.js). To overwrite this, pass an `options` object as a second argument to `Retext#use()`, with a `color` property set to `false`.

### [Node](https://github.com/wooorm/textom#textomnode-nlcstnode)#inspect()

Get a string representing `node`.

There’s no need to call `Node#inspect()` when in Node.js. In Node.js, `console.log` and `util.inspect` all [show the tree diagram](http://nodejs.org/api/util.html#util_util_inspect_object_options) as seen above.

To log the nodes as normal objects, pass `customInspect: false` to `util.inspect()`:

```javascript
console.log(util.inspect(tree, {
    'customInspect': false
}))
```

## Performance

```text
             TextOM.Node#inspect()
  1,062 op/s » A paragraph (5 sentences, 100 words)
    101 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)
      9 op/s » An article (100 paragraphs, 500 sentences, 10,000 words)
```

## License

MIT © [Titus Wormer](http://wooorm.com)
