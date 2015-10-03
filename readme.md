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

retext().use(function () {
    return function (cst) {
        console.log(inspect(cst));
    }
}).process('Some simple text.');
```

Yields:

```text
RootNode[1] (1:1-1:18, 0-17)
└─ ParagraphNode[1] (1:1-1:18, 0-17)
   └─ SentenceNode[6] (1:1-1:18, 0-17)
      ├─ WordNode[1] (1:1-1:5, 0-4)
      │  └─ TextNode: "Some" (1:1-1:5, 0-4)
      ├─ WhiteSpaceNode: " " (1:5-1:6, 4-5)
      ├─ WordNode[1] (1:6-1:12, 5-11)
      │  └─ TextNode: "simple" (1:6-1:12, 5-11)
      ├─ WhiteSpaceNode: " " (1:12-1:13, 11-12)
      ├─ WordNode[1] (1:13-1:17, 12-16)
      │  └─ TextNode: "text" (1:13-1:17, 12-16)
      └─ PunctuationNode: "." (1:17-1:18, 16-17)
```

## API

### inspect([node](https://github.com/wooorm/unist#unist-nodes))

By default, color support is enabled on node and turned off anywhere else.
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
