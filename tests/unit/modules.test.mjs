// Which built modules are server components and which are client boundaries. A module
// that gains 'use client' by accident sends its code to every browser.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const dist = new URL('../../packages/ui/dist/', import.meta.url)
const directive = (module) =>
  readFileSync(new URL(`${module}.js`, dist), 'utf8').startsWith("'use client'")

const server = [
  'card',
  'empty-state',
  'list',
  'stat',
  'table',
  'filter-bar',
  'skeleton',
  'typography',
  'layout',
  'icon',
  'breadcrumbs',
  'page-header',
  'sparkline',
  'status',
  'spinner',
  'index',
]
const client = ['button', 'dialog', 'select', 'tabs', 'file-upload', 'sizing']

for (const module of server)
  test(`${module} renders on the server without a client boundary`, () => {
    assert.equal(directive(module), false)
  })
for (const module of client)
  test(`${module} is a client boundary`, () => {
    assert.equal(directive(module), true)
  })
