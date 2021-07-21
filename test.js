import test from 'tape'
import chalk from 'chalk'
import strip from 'strip-ansi'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {x} from 'xastscript'
// @ts-ignore remove when typed.
import retext from 'retext'
// @ts-ignore remove when typed.
import {fromXml} from 'xast-util-from-xml'
import {inspect, inspectColor, inspectNoColor} from './index.js'

const chalkEnabled = new chalk.Instance({level: 1})

const paragraph = 'Some simple text. Other “sentence”.'

test('inspect', (t) => {
  t.equal(typeof inspect, 'function', 'should be a `function`')

  t.end()
})

test('inspect()', (t) => {
  t.equal(
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

  t.equal(
    strip(inspect([u('SymbolNode', '$'), u('WordNode', [u('text', '5,00')])])),
    '├─0 SymbolNode "$"\n└─1 WordNode[1]\n    └─0 text "5,00"',
    'should work with a list of nodes'
  )

  t.test('should work on non-nodes', (st) => {
    st.equal(strip(inspect('foo')), '"foo"')
    st.equal(strip(inspect(null)), 'null')
    st.equal(strip(inspect(Number.NaN)), 'null')
    st.equal(strip(inspect(3)), '3')

    st.end()
  })

  t.equal(
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

  t.equal(
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

  t.equal(
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

  t.equal(
    strip(inspect({type: 'text', value: ''})),
    'text ""',
    'should work on text nodes without value'
  )

  t.equal(
    strip(inspect({type: 'thematicBreak'})),
    'thematicBreak',
    'should work on void nodes'
  )

  t.equal(
    strip(inspect(h('button', {type: 'submit', value: 'Send'}))),
    [
      'element<button>[0]',
      '  properties: {"type":"submit","value":"Send"}'
    ].join('\n'),
    'should see properties as data'
  )
  t.equal(
    strip(inspect(x('album', {type: 'vinyl', id: '123'}))),
    'element<album>[0]\n  attributes: {"type":"vinyl","id":"123"}',
    'should see attributes as data'
  )
  t.equal(
    strip(inspect({type: 'node', data: {type: 'notNode'}})),
    'node\n  data: {"type":"notNode"}',
    'should see data as data'
  )
  t.equal(
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

  t.equal(
    strip(inspect(fromXml('<album id="123" />'))),
    [
      'root[1]',
      '└─0 element<album>[0] (1:1-1:19, 0-18)',
      '      attributes: {"id":"123"}'
    ].join('\n'),
    'should work nodes of a certain kind (xast, hast)'
  )

  t.equal(
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

  t.equal(
    strip(
      inspect({
        type: 'foo',
        value: 'foo\nbaar',
        position: {start: {}, end: {}}
      })
    ),
    'foo "foo\\nbaar" (1:1-1:1)',
    'should work without `line` and `column` in `position`'
  )

  t.equal(
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

  t.equal(
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

  t.end()
})

test('inspectNoColor()', (t) => {
  t.equal(
    inspectNoColor(retext().parse(paragraph).children[0].children[0]),
    [
      'SentenceNode[6] (1:1-1:18, 0-17)',
      '├─0 WordNode[1] (1:1-1:5, 0-4)',
      '│   └─0 TextNode "Some" (1:1-1:5, 0-4)',
      '├─1 WhiteSpaceNode " " (1:5-1:6, 4-5)',
      '├─2 WordNode[1] (1:6-1:12, 5-11)',
      '│   └─0 TextNode "simple" (1:6-1:12, 5-11)',
      '├─3 WhiteSpaceNode " " (1:12-1:13, 11-12)',
      '├─4 WordNode[1] (1:13-1:17, 12-16)',
      '│   └─0 TextNode "text" (1:13-1:17, 12-16)',
      '└─5 PunctuationNode "." (1:17-1:18, 16-17)'
    ].join('\n'),
    'should work'
  )

  t.end()
})

test('inspectColor()', (t) => {
  t.equal(
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

  t.end()
})
