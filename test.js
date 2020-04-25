'use strict'

var test = require('tape')
var chalk = require('chalk')
var strip = require('strip-ansi')
var retext = require('retext')
var fromXml = require('xast-util-from-xml')
var inspect = require('.')

var chalkEnabled = new chalk.Instance({level: 1})

var paragraph = 'Some simple text. Other “sentence”.'

test('inspect', function (t) {
  t.equal(typeof inspect, 'function', 'should be a `function`')

  t.test('should have `color` and `noColor` properties', function (st) {
    st.equal(typeof inspect.color, 'function')
    st.equal(typeof inspect.noColor, 'function')

    st.equal(typeof inspect.color.noColor, 'function')
    st.equal(typeof inspect.noColor.color, 'function')

    st.end()
  })

  t.end()
})

test('inspect()', function (t) {
  t.equal(
    strip(inspect(retext().parse(paragraph))),
    [
      'RootNode[1] (1:1-1:36, 0-35)',
      '└─ ParagraphNode[3] (1:1-1:36, 0-35)',
      '   ├─ SentenceNode[6] (1:1-1:18, 0-17)',
      '   │  ├─ WordNode[1] (1:1-1:5, 0-4)',
      '   │  │  └─ TextNode: "Some" (1:1-1:5, 0-4)',
      '   │  ├─ WhiteSpaceNode: " " (1:5-1:6, 4-5)',
      '   │  ├─ WordNode[1] (1:6-1:12, 5-11)',
      '   │  │  └─ TextNode: "simple" (1:6-1:12, 5-11)',
      '   │  ├─ WhiteSpaceNode: " " (1:12-1:13, 11-12)',
      '   │  ├─ WordNode[1] (1:13-1:17, 12-16)',
      '   │  │  └─ TextNode: "text" (1:13-1:17, 12-16)',
      '   │  └─ PunctuationNode: "." (1:17-1:18, 16-17)',
      '   ├─ WhiteSpaceNode: " " (1:18-1:19, 17-18)',
      '   └─ SentenceNode[6] (1:19-1:36, 18-35)',
      '      ├─ WordNode[1] (1:19-1:24, 18-23)',
      '      │  └─ TextNode: "Other" (1:19-1:24, 18-23)',
      '      ├─ WhiteSpaceNode: " " (1:24-1:25, 23-24)',
      '      ├─ PunctuationNode: "“" (1:25-1:26, 24-25)',
      '      ├─ WordNode[1] (1:26-1:34, 25-33)',
      '      │  └─ TextNode: "sentence" (1:26-1:34, 25-33)',
      '      ├─ PunctuationNode: "”" (1:34-1:35, 33-34)',
      '      └─ PunctuationNode: "." (1:35-1:36, 34-35)'
    ].join('\n'),
    'should work on `RootNode`'
  )

  t.equal(
    strip(inspect(retext().parse(paragraph).children[0].children[0])),
    [
      'SentenceNode[6] (1:1-1:18, 0-17)',
      '├─ WordNode[1] (1:1-1:5, 0-4)',
      '│  └─ TextNode: "Some" (1:1-1:5, 0-4)',
      '├─ WhiteSpaceNode: " " (1:5-1:6, 4-5)',
      '├─ WordNode[1] (1:6-1:12, 5-11)',
      '│  └─ TextNode: "simple" (1:6-1:12, 5-11)',
      '├─ WhiteSpaceNode: " " (1:12-1:13, 11-12)',
      '├─ WordNode[1] (1:13-1:17, 12-16)',
      '│  └─ TextNode: "text" (1:13-1:17, 12-16)',
      '└─ PunctuationNode: "." (1:17-1:18, 16-17)'
    ].join('\n'),
    'should work on `SentenceNode`'
  )

  t.equal(
    strip(
      inspect([
        {type: 'SymbolNode', value: '$'},
        {
          type: 'WordNode',
          children: [{type: 'text', value: '5,00'}]
        }
      ])
    ),
    ['├─ SymbolNode: "$"', '└─ WordNode[1]', '   └─ text: "5,00"'].join('\n'),
    'should work with a list of nodes'
  )

  t.test('should work on non-nodes', function (st) {
    st.equal(strip(inspect('foo')), 'foo')
    st.equal(strip(inspect('null')), 'null')
    st.equal(strip(inspect(NaN)), 'NaN')
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
    'SymbolNode: "$" [data={"test":true}]',
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
      'table[2] [align=["left","center"]]',
      '├─ tableRow[2]',
      '│  ├─ tableCell[1]',
      '│  │  └─ text: "foo"',
      '│  └─ tableCell[1]',
      '│     └─ text: "bar"',
      '└─ tableRow[2]',
      '   ├─ tableCell[1]',
      '   │  └─ text: "baz"',
      '   └─ tableCell[1]',
      '      └─ text: "qux"'
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
    'text: ""',
    'should work on text nodes without value'
  )

  t.equal(
    strip(inspect({type: 'thematicBreak'})),
    'thematicBreak',
    'should work on void nodes'
  )

  t.equal(
    strip(inspect(fromXml('<album id="123" />'))),
    [
      'root[1]',
      '└─ element<album>[0] (1:1-1:19, 0-18) [attributes={"id":"123"}]'
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
    'foo: "foo\\nbaar" (1:1-2:5)',
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
    'foo: "foo\\nbaar" (1:1-1:1)',
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
    'foo: "foo\\nbaar" (1:1-1:1, 1-8)',
    'should work with just `offset` in `position`'
  )

  t.end()
})

test('inspect.noColor()', function (t) {
  t.equal(
    inspect.noColor(retext().parse(paragraph).children[0].children[0]),
    [
      'SentenceNode[6] (1:1-1:18, 0-17)',
      '├─ WordNode[1] (1:1-1:5, 0-4)',
      '│  └─ TextNode: "Some" (1:1-1:5, 0-4)',
      '├─ WhiteSpaceNode: " " (1:5-1:6, 4-5)',
      '├─ WordNode[1] (1:6-1:12, 5-11)',
      '│  └─ TextNode: "simple" (1:6-1:12, 5-11)',
      '├─ WhiteSpaceNode: " " (1:12-1:13, 11-12)',
      '├─ WordNode[1] (1:13-1:17, 12-16)',
      '│  └─ TextNode: "text" (1:13-1:17, 12-16)',
      '└─ PunctuationNode: "." (1:17-1:18, 16-17)'
    ].join('\n'),
    'should work'
  )

  t.end()
})

test('inspect.color()', function (t) {
  t.equal(
    inspect.color(retext().parse(paragraph).children[0].children[0]),
    [
      'SentenceNode' +
        chalkEnabled.dim('[') +
        chalkEnabled.yellow('6') +
        chalkEnabled.dim(']') +
        ' (1:1-1:18, 0-17)',
      chalkEnabled.dim('├─ ') +
        'WordNode' +
        chalkEnabled.dim('[') +
        chalkEnabled.yellow('1') +
        chalkEnabled.dim(']') +
        ' (1:1-1:5, 0-4)',
      chalkEnabled.dim('│  └─ ') +
        'TextNode' +
        chalkEnabled.dim(': ') +
        chalkEnabled.green('"Some"') +
        ' (1:1-1:5, 0-4)',
      chalkEnabled.dim('├─ ') +
        'WhiteSpaceNode' +
        chalkEnabled.dim(': ') +
        chalkEnabled.green('" "') +
        ' (1:5-1:6, 4-5)',
      chalkEnabled.dim('├─ ') +
        'WordNode' +
        chalkEnabled.dim('[') +
        chalkEnabled.yellow('1') +
        chalkEnabled.dim(']') +
        ' (1:6-1:12, 5-11)',
      chalkEnabled.dim('│  └─ ') +
        'TextNode' +
        chalkEnabled.dim(': ') +
        chalkEnabled.green('"simple"') +
        ' (1:6-1:12, 5-11)',
      chalkEnabled.dim('├─ ') +
        'WhiteSpaceNode' +
        chalkEnabled.dim(': ') +
        chalkEnabled.green('" "') +
        ' (1:12-1:13, 11-12)',
      chalkEnabled.dim('├─ ') +
        'WordNode' +
        chalkEnabled.dim('[') +
        chalkEnabled.yellow('1') +
        chalkEnabled.dim(']') +
        ' (1:13-1:17, 12-16)',
      chalkEnabled.dim('│  └─ ') +
        'TextNode' +
        chalkEnabled.dim(': ') +
        chalkEnabled.green('"text"') +
        ' (1:13-1:17, 12-16)',
      chalkEnabled.dim('└─ ') +
        'PunctuationNode' +
        chalkEnabled.dim(': ') +
        chalkEnabled.green('"."') +
        ' (1:17-1:18, 16-17)'
    ].join('\n'),
    'should work'
  )

  t.end()
})
