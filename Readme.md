# retext-inspect [![Build Status](https://img.shields.io/travis/wooorm/retext-inspect.svg?style=flat)](https://travis-ci.org/wooorm/retext-inspect) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-inspect.svg?style=flat)](https://coveralls.io/r/wooorm/retext-inspect?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** node inspector.

## Installation

npm:
```sh
$ npm install retext-inspect
```

Component:
```sh
$ component install wooorm/retext-inspect
```

Bower:
```sh
$ bower install retext-inspect
```

## Usage

```js
var Retext,
    retext,
    inspect;

Retext = require('retext');
inspect = require('retext-inspect');

retext = new Retext().use(inspect);

retext.parse('Some simple text.', function (err, tree) {
    /* Inspect a node: */
    console.log(tree.head.head.tail.inspect());
    /**
     * Logs:
     *
     * PunctuationNode[1]
     * └─ TextNode: '.'
     */

    /* Inspect a node in Node.js: */
    console.log(tree);
    /**
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

### Retext#use(inspect, options?)

The diagram returned by `inspect` uses color to make things more awesome. Support is detected by checking if a `util.inspect` exists (it does in Node.js). To overwrite this, pass an `options` object as a second argument to `Retext#use`, with a `color` property set to `false`:

```js
retext = new Retext().use(inspect, {
    'color': false
});
```

### Node#inspect()

Get a string representing `node`.

There’s no need to call `Node#inspect()` when in Node.js. In Node.js, `console.log` and `util.inspect` all [show the tree diagram](http://nodejs.org/api/util.html#util_util_inspect_object_options) as seen above.

To log the nodes as normal objects, pass `customInspect: false` to `util.inspect()`:

```js
console.log(util.inspect(tree, {
    'customInspect': false
}))
```

## License

MIT © Titus Wormer
