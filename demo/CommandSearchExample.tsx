import React, { useEffect, useRef, useState } from 'react'
import {
  Text,
  Field,
  Button,
  Combobox,
  Dialog,
  Kbd,
  ScrollArea,
} from '@surflane/ui'
import { catalog, itemHref, type CatalogItem } from './catalog'
import { navigate } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/CommandSearchExample'

type Command = {
  id: string
  label: string
  description: string
  category: string
  disabled: boolean
  href?: string
  action?: 'theme'
}
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
  const t = text[useLocale().locale]
  const commands: Command[] = [
    {
      id: 'rotate-theme',
      label: t.switchThemeLabel,
      description: t.switchThemeDescription,
      category: t.actionCategory,
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
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState('')
  const [notice, setNotice] = useState(t.noCommandExecuted)
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
      setNotice(t.appearanceUpdated)
    } else navigation.current = command.href ?? null
    setOpen(false)
  }
  const count = commands.filter((command) => matches(command, query)).length
  return (
    <div className='example-stack command-search-example'>
      <p>{t.intro}</p>
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
            {t.searchDocumentation}
            {/* aria-keyshortcuts names the shortcut; the key cap is for sight. */}
            <Kbd keys={['mod', 'k']} aria-hidden='true' />
          </Dialog.Trigger>
          <Dialog.Content
            className='command-search-dialog'
            closeLabel={t.closeCommandSearch}
            aria-modal='true'
            initialFocus={input}
            finalFocus={() => (navigation.current ? false : trigger.current)}
          >
            <Dialog.Header>
              <Dialog.Title>{t.commandSearchTitle}</Dialog.Title>
              <Dialog.Description>
                {t.commandSearchDescription}
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body className='command-search-body'>
              <Field.Root>
                <Field.Label>{t.searchPagesAndActions}</Field.Label>
                <Combobox.Input
                  ref={input}
                  placeholder={t.searchPlaceholder}
                  autoComplete='off'
                />
              </Field.Root>
              <Text
                as='div'
                role='status'
                aria-label={t.searchResultsCount}
                variant='caption'
                color='muted'
              >
                {t.results(count)}
              </Text>
              <ScrollArea
                orientation='vertical'
                label={t.commandResults}
                tabIndex={-1}
                scrollChain='contain'
                rootClassName='command-search-results'
                className='command-search-results-viewport'
              >
                <Combobox.Empty>{t.noResults}</Combobox.Empty>
                <Combobox.List aria-label={t.pagesAndActions}>
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
                          {command.disabled ? t.planned : command.category}
                        </small>
                      </span>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </ScrollArea>
              <Text variant='caption' color='muted'>
                <Kbd keys='up' labels={t.keyLabels} />{' '}
                <Kbd keys='down' labels={t.keyLabels} /> {t.keyChoose} ·{' '}
                <Kbd keys='enter' /> {t.keyOpen} · <Kbd keys='escape' />{' '}
                {t.keyClose}
              </Text>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </Combobox.Root>
      <p role='status' aria-label={t.commandResult}>
        {notice}
      </p>
    </div>
  )
}
