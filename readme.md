# unist-util-inspect [![Build Status][build-badge]][build-page] [![Coverage Status][coverage-badge]][coverage-page]

[Unist][] node inspector.

## Installation

[npm][]:

```bash
npm install unist-util-inspect
```

## Usage

```javascript
var retext = require('retext');
var inspect = require('unist-util-inspect');

retext().use(plugin).process('Some simple text.');

function plugin() {
  return transformer;
  function transformer(tree) {
    console.log(inspect(tree));
  }
}
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

### `inspect(node)`

By default, color support is enabled on Node.js and turned off anywhere else.
See below on how to change that.

###### Parameters

*   `node` ([`Node`][node]).

###### Returns

`string` — String representing `node`.

### `inspect.<style>[.<style>...](node)`

Where `<style>` is either `color` or `noColor`.

To explicitly add or remove ANSI sequences, use either `inspect.color(node)`
or `inspect.noColor(node)`.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/wooorm/unist-util-inspect.svg

[build-page]: https://travis-ci.org/wooorm/unist-util-inspect

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/unist-util-inspect.svg

[coverage-page]: https://codecov.io/github/wooorm/unist-util-inspect?branch=master

[unist]: https://github.com/wooorm/unist

[npm]: https://docs.npmjs.com/cli/install

[node]: https://github.com/wooorm/unist#unist-nodes

[license]: LICENSE

[author]: http://wooorm.com
