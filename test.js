import assert from 'node:assert/strict'
import test from 'node:test'
/* eslint-disable-next-line unicorn/import-style */
import {Chalk} from 'chalk'
import strip from 'strip-ansi'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {x} from 'xastscript'
import {retext} from 'retext'
import {fromXml} from 'xast-util-from-xml'
import {inspect, inspectColor, inspectNoColor} from './index.js'

const chalkEnabled = new Chalk({level: 1})

const paragraph = 'Some simple text. Other “sentence”.'

test('inspect', () => {
  assert.equal(typeof inspect, 'function', 'should be a `function`')
})

test('inspect()', () => {
  assert.equal(
    strip(inspect(retext().parse(paragraph))),
    [
      'RootNode[1] (1:1-1:36, 0-35)',
      '└─0 ParagraphNode[3] (1:1-1:36, 0-35)',
      '    ├─0 SentenceNode[6] (1:1-1:18, 0-17)',
      '    │   ├─0 WordNode[1] (1:1-1:5, 0-4)',
      '    │   │   └─0 TextNode "Some" (1:1-1:5, 0-4)',
      '    │   ├─1 WhiteSpaceNode " " (1:5-1:6, 4-5)',
      '    │   ├─2 WordNode[1] (1:6-1:12, 5-11)',
      '    │   │   └─0 TextNode "simple" (1:6-1:12, 5-11)',
      '    │   ├─3 WhiteSpaceNode " " (1:12-1:13, 11-12)',
      '    │   ├─4 WordNode[1] (1:13-1:17, 12-16)',
      '    │   │   └─0 TextNode "text" (1:13-1:17, 12-16)',
      '    │   └─5 PunctuationNode "." (1:17-1:18, 16-17)',
      '    ├─1 WhiteSpaceNode " " (1:18-1:19, 17-18)',
      '    └─2 SentenceNode[6] (1:19-1:36, 18-35)',
      '        ├─0 WordNode[1] (1:19-1:24, 18-23)',
      '        │   └─0 TextNode "Other" (1:19-1:24, 18-23)',
      '        ├─1 WhiteSpaceNode " " (1:24-1:25, 23-24)',
      '        ├─2 PunctuationNode "“" (1:25-1:26, 24-25)',
      '        ├─3 WordNode[1] (1:26-1:34, 25-33)',
      '        │   └─0 TextNode "sentence" (1:26-1:34, 25-33)',
      '        ├─4 PunctuationNode "”" (1:34-1:35, 33-34)',
      '        └─5 PunctuationNode "." (1:35-1:36, 34-35)'
    ].join('\n'),
    'should work on `RootNode`'
  )

  assert.equal(
    strip(inspect([u('SymbolNode', '$'), u('WordNode', [u('text', '5,00')])])),
    '├─0 SymbolNode "$"\n└─1 WordNode[1]\n    └─0 text "5,00"',
    'should work with a list of nodes'
  )

  assert.doesNotThrow(() => {
    assert.equal(strip(inspect('foo')), '"foo"')
    assert.equal(strip(inspect(null)), 'null')
    assert.equal(strip(inspect(Number.NaN)), 'null')
    assert.equal(strip(inspect(3)), '3')
  }, 'should work on non-nodes')

  assert.equal(
    strip(
      inspect(
        Array.from({length: 11}).map((/** @type {undefined} */ d, i) => ({
          type: 'text',
          value: String(i),
          data: {id: String.fromCodePoint(97 + i)}
        }))
      )
    ),
    [
      '├─0  text "0"',
      '│      data: {"id":"a"}',
      '├─1  text "1"',
      '│      data: {"id":"b"}',
      '├─2  text "2"',
      '│      data: {"id":"c"}',
      '├─3  text "3"',
      '│      data: {"id":"d"}',
      '├─4  text "4"',
      '│      data: {"id":"e"}',
      '├─5  text "5"',
      '│      data: {"id":"f"}',
      '├─6  text "6"',
      '│      data: {"id":"g"}',
      '├─7  text "7"',
      '│      data: {"id":"h"}',
      '├─8  text "8"',
      '│      data: {"id":"i"}',
      '├─9  text "9"',
      '│      data: {"id":"j"}',
      '└─10 text "10"',
      '       data: {"id":"k"}'
    ].join('\n'),
    'should align and indent large numbers'
  )

  assert.equal(
    strip(
      inspect({
        type: 'SymbolNode',
        value: '$',
        data: {test: true}
      })
    ),
    'SymbolNode "$"\n  data: {"test":true}',
    'should work with data attributes'
  )

  assert.equal(
    strip(
      inspect({
        type: 'table',
        align: ['left', 'center'],
        children: [
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{type: 'text', value: 'foo'}]
              },
              {
                type: 'tableCell',
                children: [{type: 'text', value: 'bar'}]
              }
            ]
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{type: 'text', value: 'baz'}]
              },
              {
                type: 'tableCell',
                children: [{type: 'text', value: 'qux'}]
              }
            ]
          }
        ]
      })
    ),
    [
      'table[2]',
      '│ align: ["left","center"]',
      '├─0 tableRow[2]',
      '│   ├─0 tableCell[1]',
      '│   │   └─0 text "foo"',
      '│   └─1 tableCell[1]',
      '│       └─0 text "bar"',
      '└─1 tableRow[2]',
      '    ├─0 tableCell[1]',
      '    │   └─0 text "baz"',
      '    └─1 tableCell[1]',
      '        └─0 text "qux"'
    ].join('\n'),
    'should work with other attributes'
  )

  assert.equal(
    strip(
      inspect({
        type: 'element',
        tagName: 'br',
        children: []
      })
    ),
    'element<br>[0]',
    'should work on parent nodes without children'
  )

  assert.equal(
    strip(inspect({type: 'text', value: ''})),
    'text ""',
    'should work on text nodes without value'
  )

  assert.equal(
    strip(inspect({type: 'thematicBreak'})),
    'thematicBreak',
    'should work on void nodes'
  )

  assert.equal(
    strip(inspect(h('button', {type: 'submit', value: 'Send'}))),
    [
      'element<button>[0]',
      '  properties: {"type":"submit","value":"Send"}'
    ].join('\n'),
    'should see properties as data'
  )
  assert.equal(
    strip(inspect(x('album', {type: 'vinyl', id: '123'}))),
    'element<album>[0]\n  attributes: {"type":"vinyl","id":"123"}',
    'should see attributes as data'
  )
  assert.equal(
    strip(inspect({type: 'node', data: {type: 'notNode'}})),
    'node\n  data: {"type":"notNode"}',
    'should see data as data'
  )
  assert.equal(
    strip(
      inspect(
        u(
          'jsxSpan',
          {
            open: u('jsxTag', {
              close: false,
              selfClosing: false,
              name: u('jsxMember', {
                object: u('jsxMember', {
                  object: u('jsxIdentifier', 'abc'),
                  property: u('jsxIdentifier', 'def')
                }),
                property: u('jsxIdentifier', 'ghi')
              }),
              attributes: [
                u('jsxAttribute', {
                  name: u('jsxIdentifier', 'alpha'),
                  value: null
                }),
                u('jsxAttributeExpression', '...props'),
                u('jsxAttribute', {
                  name: u('jsxIdentifier', 'bravo'),
                  value: null
                })
              ]
            }),
            close: u('jsxTag', {
              close: true,
              selfClosing: false,
              name: u('jsxMember', {
                object: u('jsxMember', {
                  object: u('jsxIdentifier', 'abc'),
                  property: u('jsxIdentifier', 'def')
                }),
                property: u('jsxIdentifier', 'ghi')
              }),
              attributes: []
            })
          },
          [u('jsxExpressionSpan', '1 + 1')]
        )
      )
    ),
    [
      'jsxSpan[1]',
      '│ open: jsxTag',
      '│   close: false',
      '│   selfClosing: false',
      '│   name: jsxMember',
      '│     object: jsxMember',
      '│       object: jsxIdentifier "abc"',
      '│       property: jsxIdentifier "def"',
      '│     property: jsxIdentifier "ghi"',
      '│   attributes:',
      '│   ├─0 jsxAttribute',
      '│   │     name: jsxIdentifier "alpha"',
      '│   ├─1 jsxAttributeExpression "...props"',
      '│   └─2 jsxAttribute',
      '│         name: jsxIdentifier "bravo"',
      '│ close: jsxTag',
      '│   close: true',
      '│   selfClosing: false',
      '│   name: jsxMember',
      '│     object: jsxMember',
      '│       object: jsxIdentifier "abc"',
      '│       property: jsxIdentifier "def"',
      '│     property: jsxIdentifier "ghi"',
      '│   attributes: []',
      '└─0 jsxExpressionSpan "1 + 1"'
    ].join('\n'),
    'should handle nodes outside of children'
  )

  assert.equal(
    strip(inspect(fromXml('<album id="123" />'))),
    [
      'root[1]',
      '└─0 element<album>[0] (1:1-1:19, 0-18)',
      '      attributes: {"id":"123"}'
    ].join('\n'),
    'should work nodes of a certain kind (xast, hast)'
  )

  assert.equal(
    strip(
      inspect({
        type: 'foo',
        value: 'foo\nbaar',
        position: {
          start: {line: 1, column: 1},
          end: {line: 2, column: 5}
        }
      })
    ),
    'foo "foo\\nbaar" (1:1-2:5)',
    'should work without `offset` in `position`'
  )

  assert.equal(
    strip(
      inspect({
        type: 'foo',
        value: 'foo\nbaar',
        position: {}
      })
    ),
    'foo "foo\\nbaar"',
    'should work without `start` and `end` in `position`'
  )

  assert.equal(
    strip(
      inspect({
        type: 'foo',
        value: 'foo\nbaar',
        position: {start: {}, end: {}}
      })
    ),
    'foo "foo\\nbaar" (1:1-1:1)',
    'should work without `line` and `column` in `point`'
  )

  assert.equal(
    strip(
      inspect({
        type: 'foo',
        value: 'foo\nbaar',
        position: {
          start: {offset: 1},
          end: {offset: 8}
        }
      })
    ),
    'foo "foo\\nbaar" (1:1-1:1, 1-8)',
    'should work with just `offset` in `position`'
  )

  assert.equal(
    strip(inspect(retext().parse(paragraph), {showPositions: false})),
    [
      'RootNode[1]',
      '└─0 ParagraphNode[3]',
      '    ├─0 SentenceNode[6]',
      '    │   ├─0 WordNode[1]',
      '    │   │   └─0 TextNode "Some"',
      '    │   ├─1 WhiteSpaceNode " "',
      '    │   ├─2 WordNode[1]',
      '    │   │   └─0 TextNode "simple"',
      '    │   ├─3 WhiteSpaceNode " "',
      '    │   ├─4 WordNode[1]',
      '    │   │   └─0 TextNode "text"',
      '    │   └─5 PunctuationNode "."',
      '    ├─1 WhiteSpaceNode " "',
      '    └─2 SentenceNode[6]',
      '        ├─0 WordNode[1]',
      '        │   └─0 TextNode "Other"',
      '        ├─1 WhiteSpaceNode " "',
      '        ├─2 PunctuationNode "“"',
      '        ├─3 WordNode[1]',
      '        │   └─0 TextNode "sentence"',
      '        ├─4 PunctuationNode "”"',
      '        └─5 PunctuationNode "."'
    ].join('\n'),
    'should support `showPositions: false`'
  )
})

test('inspectNoColor()', () => {
  assert.equal(
    inspectNoColor(retext().parse(paragraph)),
    [
      'RootNode[1] (1:1-1:36, 0-35)\n└─0 ParagraphNode[3] (1:1-1:36, 0-35)',
      '    ├─0 SentenceNode[6] (1:1-1:18, 0-17)',
      '    │   ├─0 WordNode[1] (1:1-1:5, 0-4)',
      '    │   │   └─0 TextNode "Some" (1:1-1:5, 0-4)',
      '    │   ├─1 WhiteSpaceNode " " (1:5-1:6, 4-5)',
      '    │   ├─2 WordNode[1] (1:6-1:12, 5-11)',
      '    │   │   └─0 TextNode "simple" (1:6-1:12, 5-11)',
      '    │   ├─3 WhiteSpaceNode " " (1:12-1:13, 11-12)',
      '    │   ├─4 WordNode[1] (1:13-1:17, 12-16)',
      '    │   │   └─0 TextNode "text" (1:13-1:17, 12-16)',
      '    │   └─5 PunctuationNode "." (1:17-1:18, 16-17)',
      '    ├─1 WhiteSpaceNode " " (1:18-1:19, 17-18)',
      '    └─2 SentenceNode[6] (1:19-1:36, 18-35)',
      '        ├─0 WordNode[1] (1:19-1:24, 18-23)',
      '        │   └─0 TextNode "Other" (1:19-1:24, 18-23)',
      '        ├─1 WhiteSpaceNode " " (1:24-1:25, 23-24)',
      '        ├─2 PunctuationNode "“" (1:25-1:26, 24-25)',
      '        ├─3 WordNode[1] (1:26-1:34, 25-33)',
      '        │   └─0 TextNode "sentence" (1:26-1:34, 25-33)',
      '        ├─4 PunctuationNode "”" (1:34-1:35, 33-34)',
      '        └─5 PunctuationNode "." (1:35-1:36, 34-35)'
    ].join('\n'),
    'should work'
  )
})

test('inspectColor()', () => {
  assert.equal(
    // @ts-expect-error: fine.
    inspectColor(retext().parse(paragraph).children[0].children[0]),
    [
      chalkEnabled.bold('SentenceNode') +
        chalkEnabled.dim('[') +
        chalkEnabled.yellow('6') +
        chalkEnabled.dim(']') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:1-1:18, 0-17' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('├─0') +
        ' ' +
        chalkEnabled.bold('WordNode') +
        chalkEnabled.dim('[') +
        chalkEnabled.yellow('1') +
        chalkEnabled.dim(']') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:1-1:5, 0-4' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('│') +
        '   ' +
        chalkEnabled.dim('└─0') +
        ' ' +
        chalkEnabled.bold('TextNode') +
        ' ' +
        chalkEnabled.green('"Some"') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:1-1:5, 0-4' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('├─1') +
        ' ' +
        chalkEnabled.bold('WhiteSpaceNode') +
        ' ' +
        chalkEnabled.green('" "') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:5-1:6, 4-5' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('├─2') +
        ' ' +
        chalkEnabled.bold('WordNode') +
        chalkEnabled.dim('[') +
        chalkEnabled.yellow('1') +
        chalkEnabled.dim(']') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:6-1:12, 5-11' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('│') +
        '   ' +
        chalkEnabled.dim('└─0') +
        ' ' +
        chalkEnabled.bold('TextNode') +
        ' ' +
        chalkEnabled.green('"simple"') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:6-1:12, 5-11' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('├─3') +
        ' ' +
        chalkEnabled.bold('WhiteSpaceNode') +
        ' ' +
        chalkEnabled.green('" "') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:12-1:13, 11-12' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('├─4') +
        ' ' +
        chalkEnabled.bold('WordNode') +
        chalkEnabled.dim('[') +
        chalkEnabled.yellow('1') +
        chalkEnabled.dim(']') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:13-1:17, 12-16' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('│') +
        '   ' +
        chalkEnabled.dim('└─0') +
        ' ' +
        chalkEnabled.bold('TextNode') +
        ' ' +
        chalkEnabled.green('"text"') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:13-1:17, 12-16' +
        chalkEnabled.dim(')'),
      chalkEnabled.dim('└─5') +
        ' ' +
        chalkEnabled.bold('PunctuationNode') +
        ' ' +
        chalkEnabled.green('"."') +
        ' ' +
        chalkEnabled.dim('(') +
        '1:17-1:18, 16-17' +
        chalkEnabled.dim(')')
    ].join('\n'),
    'should work'
  )
})
