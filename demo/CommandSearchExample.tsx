import React, { useEffect, useRef, useState } from 'react'
import { Button, Combobox, Dialog, ScrollArea } from '@surflane/ui'
import { catalog, itemHref, type CatalogItem } from './catalog'
import { navigate } from './router'

type Command = {
  id: string
  label: string
  description: string
  category: string
  disabled: boolean
  href?: string
  action?: 'theme'
}
const commands: Command[] = [
  {
    id: 'rotate-theme',
    label: 'Rotate theme',
    description: 'Switch between Light, Dark and System',
    category: 'Action',
    disabled: false,
    action: 'theme',
  },
  ...catalog.map((item: CatalogItem) => ({
    id: `${item.kind}/${item.id}`,
    label: item.name,
    description: item.summary,
    category: `${item.kind} / ${item.group}`,
    disabled: item.stage !== 'available',
    href: itemHref(item),
  })),
]
function normalized(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().trim()
}
function matches(command: Command, query: string) {
  const text = normalized(
    `${command.label} ${command.description} ${command.category}`,
  )
  return normalized(query)
    .split(/\s+/)
    .every((term) => text.includes(term))
}
function editing(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]',
    )
  )
}
export function CommandSearchExample({
  toggleTheme,
}: {
  toggleTheme: () => void
}) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState('')
  const [notice, setNotice] = useState('No command executed.')
  const trigger = useRef<HTMLButtonElement>(null),
    input = useRef<HTMLInputElement>(null)
  const navigation = useRef<string | null>(null),
    executed = useRef(false)
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        event.altKey ||
        event.shiftKey ||
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== 'k' ||
        editing(event.target)
      )
        return
      // This demonstration owns the shortcut only while its route is mounted.
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
      event.preventDefault()
      setOpen(true)
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  function changeOpen(next: boolean) {
    if (next) {
      setQuery('')
      executed.current = false
      navigation.current = null
    }
    setOpen(next)
  }
  function execute(command: Command | null) {
    if (!command || command.disabled || executed.current) return
    executed.current = true
    if (command.action === 'theme') {
      toggleTheme()
      setNotice('Appearance updated. The catalog page is unchanged.')
    } else navigation.current = command.href ?? null
    setOpen(false)
  }
  const count = commands.filter((command) => matches(command, query)).length
  return (
    <div className='example-stack command-search-example'>
      <p>
        Search catalog pages or run a local appearance action. Ctrl+K or ⌘K
        opens this preview while this page is mounted; typing fields keep their
        own shortcuts.
      </p>
      <Combobox.Root<Command>
        inline
        open={open}
        onOpenChange={changeOpen}
        items={commands}
        filter={matches}
        value={null}
        inputValue={query}
        onInputValueChange={setQuery}
        itemToStringLabel={(command) => command.label}
        isItemEqualToValue={(a, b) => a.id === b.id}
        autoHighlight
        onValueChange={execute}
      >
        <Dialog.Root
          open={open}
          onOpenChange={changeOpen}
          onOpenChangeComplete={(isOpen) => {
            if (!isOpen) {
              const href = navigation.current
              navigation.current = null
              if (href) navigate(href)
            }
          }}
        >
          <Dialog.Trigger
            render={
              <Button
                ref={trigger}
                variant='outline'
                aria-keyshortcuts='Control+k Meta+k'
              />
            }
          >
            Search documentation
          </Dialog.Trigger>
          <Dialog.Content
            className='command-search-dialog'
            closeLabel='Close command search'
            aria-modal='true'
            initialFocus={input}
            finalFocus={() => (navigation.current ? false : trigger.current)}
          >
            <Dialog.Header>
              <Dialog.Title>Command search</Dialog.Title>
              <Dialog.Description>
                Type a name, purpose or category. Use arrow keys to choose and
                Enter to open. Planned pages cannot be opened.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body className='command-search-body'>
              <label className='command-search-label'>
                Search pages and actions
                <Combobox.Input
                  ref={input}
                  placeholder='Name, purpose, category…'
                  autoComplete='off'
                />
              </label>
              <div
                role='status'
                aria-label='Search results count'
                className='muted'
              >
                {count} {count === 1 ? 'result' : 'results'}
              </div>
              <ScrollArea
                orientation='vertical'
                label='Command results'
                tabIndex={-1}
                scrollChain='contain'
                rootClassName='command-search-results'
                className='command-search-results-viewport'
              >
                <Combobox.Empty>
                  No results. Try a shorter name or another category.
                </Combobox.Empty>
                <Combobox.List aria-label='Pages and actions'>
                  {(command: Command) => (
                    <Combobox.Item
                      key={command.id}
                      value={command}
                      disabled={command.disabled}
                    >
                      <span className='command-search-item'>
                        <strong>{command.label}</strong>
                        <span>{command.description}</span>
                        <small>
                          {command.disabled ? 'Planned' : command.category}
                        </small>
                      </span>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </ScrollArea>
              <p className='muted'>↑ ↓ Choose / Enter Open / Escape Close</p>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </Combobox.Root>
      <p role='status' aria-label='Command result'>
        {notice}
      </p>
    </div>
  )
}
