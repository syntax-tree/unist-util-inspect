# unist-util-inspect

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[unist][] utility to inspect trees.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`inspect(node[, options])`](#inspectnode-options)
    *   [`inspectColor(node[, options])`](#inspectcolornode-options)
    *   [`inspectNoColor(node[, options])`](#inspectnocolornode-options)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This is a utility pretty prints the tree.

## When should I use this?

This utility pretty prints the tree in a format that is made custom for unist
trees, which is terser than the often verbose and repetitive JSON,
to more easily spot bugs and see what’s going on in the tree.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, 18.0+), install with [npm][]:

```sh
npm install unist-util-inspect
```

In Deno with [`esm.sh`][esmsh]:

```js
import {inspect} from "https://esm.sh/unist-util-inspect@8"
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {inspect} from "https://esm.sh/unist-util-inspect@7?bundle"
</script>
```

## Use

```js
import {u} from 'unist-builder'
import {inspect} from 'unist-util-inspect'

const tree = u('root', [
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

This package exports the identifiers `inspect`, `inspectColor`, and
`inspectNoColor`.
There is no default export.

### `inspect(node[, options])`

Inspect the given `node` ([`Node`][node]).
By default, colors are added in Node, and not in other places.
See below on how to change that.

###### `options.showPositions`

Whether to include positional information (`boolean`, default: `true`).

##### Returns

Pretty printed `node` (`string`).

### `inspectColor(node[, options])`

Inspect with ANSI color sequences (default in Node, Deno).

### `inspectNoColor(node[, options])`

Inspect without ANSI color sequences (default in browser, `react-native`).

## Types

This package is fully typed with [TypeScript][].
It exports the additional type `Options`.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://github.com/syntax-tree/unist-util-inspect/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/unist-util-inspect/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-inspect.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-util-inspect

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-inspect.svg

[downloads]: https://www.npmjs.com/package/unist-util-inspect

[size-badge]: https://img.shields.io/bundlephobia/minzip/unist-util-inspect.svg

[size]: https://bundlephobia.com/result?p=unist-util-inspect

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node
