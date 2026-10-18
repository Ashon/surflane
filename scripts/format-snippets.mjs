// Formats the catalog's example code with the repository's Prettier config:
// `code` properties in demo/*Docs.ts, literal CodeBlock code, language-keyed
// samples (`tsx: '…'`) and tsx/css/json fences inside Markdown sources.
// `--check` fails if any example would change.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')
const files = readdirSync(join(root, 'demo'))
  .filter((name) => /\.tsx?$/.test(name))
  .map((name) => join(root, 'demo', name))
const config = await prettier.resolveConfig(files[0])
const extensions = {
  tsx: 'tsx',
  typescript: 'tsx',
  ts: 'tsx',
  jsx: 'tsx',
  css: 'css',
  json: 'json',
}

// Snippets are read, not run: drop the ASI guard Prettier puts before JSX roots.
const format = async (code, extension) =>
  (await prettier.format(code, { ...config, filepath: `snippet.${extension}` }))
    .trimEnd()
    .replace(/^;(?=<)/gm, '')

// Most snippets list imports and statements, then sibling JSX roots, which is
// not a valid program. Split them at column 0: each JSX root is formatted on its
// own, the code between roots as one program, and the parts keep their gaps.
function splitParts(code) {
  const parts = []
  let gap = false
  for (const line of code.split('\n')) {
    const current = parts.at(-1)
    if (!line.trim()) {
      gap = true
      continue
    }
    const continues =
      current &&
      (/^\s/.test(line) ||
        (current.jsx ? /^(<\/|\/?>)/.test(line) : !line.startsWith('<')))
    if (continues) current.lines.push(...(gap ? [''] : []), line)
    else parts.push({ jsx: line.startsWith('<'), gap, lines: [line] })
    gap = false
  }
  return parts
}

async function formatSnippet(code, extension) {
  const ending = code.endsWith('\n') ? '\n' : ''
  try {
    return (await format(code, extension)) + ending
  } catch (error) {
    if (extension !== 'tsx') throw error
    let output = ''
    for (const part of splitParts(code)) {
      const text = await format(part.lines.join('\n'), extension)
      output += (output ? (part.gap ? '\n\n' : '\n') : '') + text
    }
    return output + ending
  }
}

async function formatMarkdownFences(markdown) {
  let output = ''
  let last = 0
  for (const match of markdown.matchAll(/^```(\w+)\n([\s\S]*?)^```$/gm)) {
    const extension = extensions[match[1].toLowerCase()]
    if (!extension) continue
    const start = match.index + match[1].length + 4
    output += markdown.slice(last, start)
    output += await formatSnippet(match[2], extension)
    last = start + match[2].length
  }
  return output + markdown.slice(last)
}

const isLiteral = (node) =>
  node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
const literal = (code) =>
  '`' +
  code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') +
  '`'

// Every example source in a module, with the language to format it as.
function findExamples(file, source) {
  const examples = []
  const variables = new Map()
  const add = (node, format, jsxAttribute = false) => {
    if (isLiteral(node)) examples.push({ node, format, jsxAttribute })
  }
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name))
      variables.set(node.name.text, node.initializer)
    if (ts.isPropertyAssignment(node)) {
      const name = node.name.getText(source)
      if (name === 'code' && file.endsWith('Docs.ts'))
        add(node.initializer, 'tsx')
      else if (extensions[name]) add(node.initializer, extensions[name])
    }
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      node.tagName.getText(source) === 'CodeBlock'
    ) {
      const attribute = (name) =>
        node.attributes.properties.find(
          (property) =>
            ts.isJsxAttribute(property) &&
            property.name.getText(source) === name,
        )?.initializer
      const language = attribute('language')
      const extension = isLiteral(language)
        ? extensions[language.text.toLowerCase()]
        : undefined
      const code = attribute('code')
      if (extension && code) {
        if (ts.isStringLiteral(code)) add(code, extension, true)
        else if (code.expression && ts.isIdentifier(code.expression))
          examples.push({ name: code.expression.text, format: extension })
        else add(code.expression, extension)
      }
    }
    if (isLiteral(node) && /^```\w+$/m.test(node.text))
      examples.push({ node, format: 'markdown' })
    ts.forEachChild(node, visit)
  }
  visit(source)
  // A CodeBlock may show a module constant: format its declaration.
  return examples
    .map((example) =>
      example.name
        ? { node: variables.get(example.name), format: example.format }
        : example,
    )
    .filter((example) => isLiteral(example.node))
}

let changed = 0
const failures = []
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  // The first rule that claims a literal decides its language.
  const claimed = new Map()
  for (const example of findExamples(file, source))
    if (!claimed.has(example.node.getStart(source)))
      claimed.set(example.node.getStart(source), example)
  const examples = [...claimed.values()].sort(
    (a, b) => b.node.getStart(source) - a.node.getStart(source),
  )
  let next = text
  for (const { node, format, jsxAttribute } of examples) {
    let formatted
    try {
      formatted =
        format === 'markdown'
          ? await formatMarkdownFences(node.text)
          : await formatSnippet(node.text, format)
    } catch (error) {
      const { line } = source.getLineAndCharacterOfPosition(
        node.getStart(source),
      )
      failures.push(`${file}:${line + 1} ${error.message.split('\n')[0]}`)
      continue
    }
    if (formatted === node.text) continue
    changed++
    const replacement = jsxAttribute
      ? `{${literal(formatted)}}`
      : literal(formatted)
    next =
      next.slice(0, node.getStart(source)) +
      replacement +
      next.slice(node.getEnd())
  }
  if (next !== text && !check) writeFileSync(file, next)
}
for (const failure of failures) console.error(`Could not format ${failure}`)
if (check && changed) {
  console.error(
    `${changed} code examples are not formatted. Run npm run format.`,
  )
  process.exit(1)
}
if (failures.length) process.exit(1)
console.log(
  `${changed} code examples ${check ? 'need formatting' : 'formatted'}`,
)
