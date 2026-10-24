// The syntax engine behind SyntaxHighlighting: roles per token, one array per line.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { highlightCode } from '../../packages/ui/dist/syntax-engine.js'

const source = `export function eta(knots: number, miles: number) {
  return miles / knots;
}`

test('TypeScript tokens get keyword, function and punctuation roles', async () => {
  const lines = await highlightCode(source, 'typescript')
  assert.equal(lines.length, 3)
  const roles = Object.fromEntries(
    lines.flat().map((token) => [token.content.trim(), token.role]),
  )
  assert.equal(roles.export, 'keyword')
  assert.equal(roles.eta, 'function')
  assert.equal(roles['{'], 'punctuation')
})

test('tokens rebuild each line exactly', async () => {
  const lines = await highlightCode(source, 'typescript')
  assert.deepEqual(
    lines.map((line) => line.map((token) => token.content).join('')),
    source.split('\n'),
  )
})

test('a long line is tokenized to its end', async () => {
  const long = `const regions = [${Array.from({ length: 400 }, (_, i) => `'r${i}'`).join(', ')}]`
  const [line] = await highlightCode(long, 'typescript')
  assert.equal(line.map((token) => token.content).join(''), long)
  assert.equal(line.at(-1).role, 'punctuation')
})

test('an unknown language or an oversized source stays plain', async () => {
  assert.equal(await highlightCode('x', 'cobol'), null)
  assert.equal(await highlightCode('x'.repeat(50001), 'typescript'), null)
})
