# unist-util-inspect [![Build Status](https://img.shields.io/travis/wooorm/unist-util-inspect.svg)](https://travis-ci.org/wooorm/unist-util-inspect) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/unist-util-inspect.svg)](https://codecov.io/github/wooorm/unist-util-inspect?branch=master)

[Unist](https://github.com/wooorm/unist) node inspector.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install unist-util-inspect
```

**unist-util-inspect** is also available as an AMD, CommonJS, and
globals module, [uncompressed and compressed](https://github.com/wooorm/unist-util-inspect/releases).

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

### inspect.\\&lt;style>\[.\\&lt;style>...](node)

Where `style` is either `color` or `noColor`.

To explicitly add or remove ANSI sequences, use either `inspect.color(node)`
or `inspect.noColor(node)`.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
