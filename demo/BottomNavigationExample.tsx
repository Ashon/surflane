import React, { useState } from 'react'
import {
  BottomNavigation,
  Checkbox,
  ChoiceLabel,
  DirectionProvider,
  Heading,
  Icon,
  List,
  ScrollArea,
  type IconName,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/BottomNavigationExample'
function Flag({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  children: React.ReactNode
}) {
  return (
    <ChoiceLabel
      control={
        <Checkbox.Root checked={checked} onCheckedChange={onChange}>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      {children}
    </ChoiceLabel>
  )
}
type Destination = 'runs' | 'schedule' | 'activity' | 'account'
const icons: Record<Destination, IconName> = {
  runs: 'play',
  schedule: 'calendar',
  activity: 'clock',
  account: 'user',
}
export function BottomNavigationExample() {
  const t = text[useLocale().locale]
  const [current, setCurrent] = useState<Destination>('runs')
  const [badges, setBadges] = useState(true)
  const [rtl, setRtl] = useState(false)
  const destinations: Destination[] = [
    'runs',
    'schedule',
    'activity',
    'account',
  ]
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Flag checked={badges} onChange={setBadges}>
          {t.showBadges}
        </Flag>
        <Flag checked={rtl} onChange={setRtl}>
          {t.rtlPreview}
        </Flag>
      </div>
      <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
        <section
          className='bottom-nav-preview'
          aria-label={t.phoneScreen}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <Heading level={3} className='bottom-nav-preview-title'>
            {t[current]}
          </Heading>
          <ScrollArea
            orientation='vertical'
            label={t[current]}
            rootClassName='bottom-nav-preview-body'
            className='bottom-nav-preview-viewport'
          >
            <List.Root aria-label={t[current]}>
              {[...t.rows[current], ...t.rows[current]].map((row, index) => (
                <List.Item key={index}>
                  <List.Content>
                    <List.Title>{row}</List.Title>
                    <List.Description>
                      {t.rowDescription(index + 1)}
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List.Root>
          </ScrollArea>
          <BottomNavigation.Root
            aria-label={t.primary}
            visible='always'
            position='static'
          >
            {destinations.map((id) => (
              <BottomNavigation.Item
                key={id}
                href={`#bottom-navigation-${id}`}
                icon={<Icon name={icons[id]} />}
                label={t[id]}
                current={current === id}
                badge={
                  !badges
                    ? undefined
                    : id === 'activity'
                      ? 3
                      : id === 'account'
                        ? true
                        : undefined
                }
                badgeLabel={
                  id === 'activity'
                    ? t.unread(3)
                    : id === 'account'
                      ? t.accountNeedsAttention
                      : undefined
                }
                onClick={(event) => {
                  event.preventDefault()
                  setCurrent(id)
                }}
              />
            ))}
          </BottomNavigation.Root>
        </section>
      </DirectionProvider>
      <p role='status'>{t.current(t[current])}</p>
    </div>
  )
}
