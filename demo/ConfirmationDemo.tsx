import React, { useState, useRef } from 'react'
import { AlertDialog, Popover, Button } from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ConfirmationDemo'

export function ConfirmationDemo() {
  const t = text[useLocale().locale]
  const [open, setOpen] = useState(false),
    [inlineOpen, setInlineOpen] = useState(false)
  const [result, setResult] = useState(t.noActionTaken)
  const cancel = useRef<HTMLButtonElement>(null)
  return (
    <section aria-labelledby='confirmations-title'>
      <h2 id='confirmations-title'>{t.heading}</h2>
      <p className='note'>{t.intro}</p>
      <div className='actions'>
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
          <AlertDialog.Trigger render={<Button variant='outline' />}>
            {t.discardTrigger}
          </AlertDialog.Trigger>
          <AlertDialog.Content initialFocus={cancel}>
            <AlertDialog.Header>
              <AlertDialog.Title>{t.discardTitle}</AlertDialog.Title>
              <AlertDialog.Description>
                {t.discardDescription}
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Close
                ref={cancel}
                render={<Button variant='outline' />}
              >
                {t.keepDraft}
              </AlertDialog.Close>
              <Button
                variant='destructive'
                onClick={() => {
                  setResult(t.draftDiscarded)
                  setOpen(false)
                }}
              >
                {t.discardPreviewDraft}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
        <Popover.Root open={inlineOpen} onOpenChange={setInlineOpen}>
          <Popover.Trigger render={<Button variant='outline' />}>
            {t.resetTrigger}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align='start'>
              <Popover.Title>{t.resetTitle}</Popover.Title>
              <Popover.Description>{t.resetDescription}</Popover.Description>
              <div className='actions'>
                <Popover.Close render={<Button variant='outline' />}>
                  {t.keepFilters}
                </Popover.Close>
                <Button
                  onClick={() => {
                    setResult(t.filtersReset)
                    setInlineOpen(false)
                  }}
                >
                  {t.resetPreviewFilters}
                </Button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <p role='status' className='note'>
        {result}
      </p>
    </section>
  )
}
