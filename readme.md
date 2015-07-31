# retext-inspect [![Build Status](https://img.shields.io/travis/wooorm/retext-inspect.svg)](https://travis-ci.org/wooorm/retext-inspect) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/retext-inspect.svg)](https://codecov.io/github/wooorm/retext-inspect?branch=master)

[**retext**](https://github.com/wooorm/retext) node inspector.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install retext-inspect
```

[Component.js](https://github.com/componentjs/component):

```bash
component install wooorm/retext-inspect
```

[Bower](http://bower.io/#install-packages):

```bash
bower install retext-inspect
```

[Duo](http://duojs.org/#getting-started):

```javascript
var inspect = require('wooorm/retext-inspect');
```

**retext-inspect** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), [duo](http://duojs.org/#getting-started),
and for AMD, CommonJS, and globals ([uncompressed](retext-inspect.js) and
[compressed](retext-inspect.min.js)).

## Usage

```javascript
var retext = require('retext');
var inspect = require('retext-inspect');

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
