# retext-inspect [![Build Status](https://travis-ci.org/wooorm/retext-inspect.svg?branch=master)](https://travis-ci.org/wooorm/retext-inspect) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-inspect.svg)](https://coveralls.io/r/wooorm/retext-inspect?branch=master)

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
    console.log(tree.inspect());
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

     console.log(tree.head.head.tail.inspect());
    /**
     * Logs:
     *
     * PunctuationNode[1]
     * └─ TextNode: '.'
     */
});
```

## API

### Node#inspect(options?)

If used, options can contain `formatNesting` and `formatNode` methods

```js
var Retext,
    retext,
    inspect,
    chalk,
    options;

Retext = require('retext');
chalk = require('chalk');
inspect = require('retext-inspect');

retext = new Retext().use(inspect);

options = {
    formatNesting: function (nesting) {
        return chalk.dim(nesting);
    },
    formatNode: function (node) {
        if ('length' in node) {
            return node.type + '[' + chalk.yellow(node.length) + ']';
        }

        return node.type + ': ' + chalk.green('\'' + node.toString() + '\'');
    }
};

retext.parse('Some simple text.', function (err, tree) {
    console.log(tree.head.head.inspect(options));
});
```

Which logs something like the following (depending on your terminal and colour scheme):

![Example output](http://wooorm.com/retext-inspect.png)

## License

MIT © Titus Wormer
