# unist-util-inspect [![Build Status](https://img.shields.io/travis/wooorm/unist-util-inspect.svg)](https://travis-ci.org/wooorm/unist-util-inspect) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/unist-util-inspect.svg)](https://codecov.io/github/wooorm/unist-util-inspect?branch=master)

[Unist](https://github.com/wooorm/unist) node inspector.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install unist-util-inspect
```

[Component.js](https://github.com/componentjs/component):

```bash
component install wooorm/unist-util-inspect
```

[Bower](http://bower.io/#install-packages):

```bash
bower install unist-util-inspect
```

[Duo](http://duojs.org/#getting-started):

```javascript
var inspect = require('wooorm/unist-util-inspect');
```

**unist-util-inspect** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), [duo](http://duojs.org/#getting-started),
and for AMD, CommonJS, and globals ([uncompressed](unist-util-inspect.js) and
[compressed](unist-util-inspect.min.js)).

## Usage

```javascript
var retext = require('retext');
var inspect = require('unist-util-inspect');

retext().use(function (cst) {
    console.log(inspect(cst));
}).process('Some simple text.');
```

Yields:

```text
RootNode[1]
└─ ParagraphNode[1]
   └─ SentenceNode[6]
      ├─ WordNode[1]
      │  └─ TextNode: 'Some'
      ├─ WhiteSpaceNode[1]
      │  └─ TextNode: ' '
      ├─ WordNode[1]
      │  └─ TextNode: 'simple'
      ├─ WhiteSpaceNode[1]
      │  └─ TextNode: ' '
      ├─ WordNode[1]
      │  └─ TextNode: 'text'
      └─ PunctuationNode[1]
         └─ TextNode: '.'
```

## API

### inspect([node](https://github.com/wooorm/unist#unist-nodes))

By default, color support is enabled on node and disabled anywhere else.
See below on how to change that.

**Parameters**

*   `node` ([`Node`](https://github.com/wooorm/unist#unist-nodes)).

**Returns** `string` — String representing `node`.

### inspect.\<style\>\[.\<style\>...\](node)

Where `style` is either `color` or `noColor`.

To explicitly add or remove ANSI sequences, use either `inspect.color(node)`
or `inspect.noColor(node)`.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
