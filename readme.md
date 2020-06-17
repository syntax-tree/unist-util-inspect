# unist-util-inspect

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**unist**][unist] utility to inspect nodes.

## Install

[npm][]:

```sh
npm install unist-util-inspect
```

## Use

```js
var u = require('unist-builder')
var inspect = require('unist-util-inspect')

var tree = u('root', [
  u('literal', '1'),
  u('parent', [
    u('void', {id: 'a'}),
    u('literal', '2'),
    u('node', {id: 'b'}, [])
  ])
])

console.log(inspect(tree))
```

Yields:

```text
root[2]
├─0 literal "1"
└─1 parent[3]
    ├─0 void
    │     id: "a"
    ├─1 literal "2"
    └─2 node[0]
          id: "b"
```

## API

### `inspect(node[, options])`

Inspect the given [`node`][node].
By default, colors are added in Node, and not in other places.
See below on how to change that.

#### Returns

`string` — String representing `node`.

#### Options

##### Example with no options

```javascript
var paragraph = 'Some simple.'
console.log(inspect(retext().parse(paragraph)))
```

```text
RootNode[1] (1:1-1:13, 0-12)
└─0 ParagraphNode[1] (1:1-1:13, 0-12)
    └─0 SentenceNode[4] (1:1-1:13, 0-12)
        ├─0 WordNode[1] (1:1-1:5, 0-4)
        │   └─0 TextNode "Some" (1:1-1:5, 0-4)
        ├─1 WhiteSpaceNode " " (1:5-1:6, 4-5)
        ├─2 WordNode[1] (1:6-1:12, 5-11)
        │   └─0 TextNode "simple" (1:6-1:12, 5-11)
        └─3 PunctuationNode "." (1:12-1:13, 11-12)
```
##### Option `showPositions`

Whether to include positional information (`boolean`, default: `true`).

```javascript
var paragraph = 'Some simple.'
console.log(inspect(retext().parse(paragraph), {showPositions: false}))
```

```text
RootNode[1]
└─0 ParagraphNode[1]
    └─0 SentenceNode[4]
        ├─0 WordNode[1]
        │   └─0 TextNode "Some"
        ├─1 WhiteSpaceNode " "
        ├─2 WordNode[1]
        │   └─0 TextNode "simple"
        └─3 PunctuationNode "."
```

##### Option `showIndex`

Whether to include child index information. (`boolean`, default: `true`).

```javascript
var paragraph = 'Some simple.'
console.log(inspect(retext().parse(paragraph), {showIndex: false}))
```

```text
RootNode[1] (1:1-1:13, 0-12)
└─ ParagraphNode[1] (1:1-1:13, 0-12)
    └─ SentenceNode[4] (1:1-1:13, 0-12)
        ├─ WordNode[1] (1:1-1:5, 0-4)
        │   └─ TextNode "Some" (1:1-1:5, 0-4)
        ├─ WhiteSpaceNode " " (1:5-1:6, 4-5)
        ├─ WordNode[1] (1:6-1:12, 5-11)
        │   └─ TextNode "simple" (1:6-1:12, 5-11)
        └─ PunctuationNode "." (1:12-1:13, 11-12)
```

##### Option `showChildCount`

Whether to include child count information. (`boolean`, default: `true`).

```javascript
var paragraph = 'Some simple.'
console.log(inspect(retext().parse(paragraph), {showChildCount: false}))
```

```text
RootNode (1:1-1:13, 0-12)
└─0 ParagraphNode (1:1-1:13, 0-12)
    └─0 SentenceNode (1:1-1:13, 0-12)
        ├─0 WordNode (1:1-1:5, 0-4)
        │   └─0 TextNode "Some" (1:1-1:5, 0-4)
        ├─1 WhiteSpaceNode " " (1:5-1:6, 4-5)
        ├─2 WordNode (1:6-1:12, 5-11)
        │   └─0 TextNode "simple" (1:6-1:12, 5-11)
        └─3 PunctuationNode "." (1:12-1:13, 11-12)
```
###### all options

```javascript
var paragraph = 'Some simple.'
console.log(inspect(retext().parse(paragraph), {showChildCount: false}))
```

```text
RootNode
└─ ParagraphNode
    └─ SentenceNode
        ├─ WordNode
        │   └─ TextNode "Some"
        ├─ WhiteSpaceNode " "
        ├─ WordNode
        │   └─ TextNode "simple"
        └─ PunctuationNode "."
```

### `inspect.<style>[.<style>…](node[, options])`

Where `<style>` is either `color` or `noColor`.

To explicitly add or remove ANSI sequences, use `inspect.color(node)` or
`inspect.noColor(node)`.

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/syntax-tree/unist-util-inspect.svg

[build]: https://travis-ci.org/syntax-tree/unist-util-inspect

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-inspect.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-util-inspect

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-inspect.svg

[downloads]: https://www.npmjs.com/package/unist-util-inspect

[size-badge]: https://img.shields.io/bundlephobia/minzip/unist-util-inspect.svg

[size]: https://bundlephobia.com/result?p=unist-util-inspect

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/syntax-tree

[unist]: https://github.com/syntax-tree/unist

[npm]: https://docs.npmjs.com/cli/install

[node]: https://github.com/syntax-tree/unist#node

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/master/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/master/support.md

[coc]: https://github.com/syntax-tree/.github/blob/master/code-of-conduct.md
