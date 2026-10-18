import React, { useState } from 'react'
import { Button, CodeBlock, Icon, iconNames, Select, Table } from '@surflane/ui'
import { Link } from './router'
export function IconographyFoundation() {
  const [count, setCount] = useState(0),
    [direction, setDirection] = useState('ltr')
  return (
    <>
      <nav className='page-toc' aria-label='On this page'>
        {['principles', 'library', 'semantics', 'direction', 'application'].map(
          (id) => (
            <a key={id} href={`#${id}`}>
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ),
        )}
      </nav>
      <section id='principles'>
        <h2>One visual language</h2>
        <p>
          Icons use a 24×24 viewBox, currentColor, a shared stroke width, and
          SVG shapes. Don't substitute special characters, emoji, or icon fonts
          for UI symbols. Product logos and illustrations are separate assets.
        </p>
        <Table.Container label='Icon design tokens' orientation='horizontal'>
          <Table.Root>
            <Table.Caption>Icon size and alignment</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>Token</Table.HeaderCell>
                <Table.HeaderCell scope='col'>Usage</Table.HeaderCell>
                <Table.HeaderCell scope='col'>Example</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <Table.Row key={size}>
                  <Table.HeaderCell scope='row'>
                    <Link href={`/tokens?q=--icon-size-${size}`}>
                      <code>--icon-size-{size}</code>
                    </Link>
                  </Table.HeaderCell>
                  <Table.Cell>
                    {size === 'sm'
                      ? '16px / compact controls'
                      : size === 'md'
                        ? '20px / general UI'
                        : '24px / emphasis'}
                  </Table.Cell>
                  <Table.Cell>
                    <Icon name='search' size={size} data-icon-specimen={size} />
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.HeaderCell scope='row'>
                  <Link href='/tokens?q=--icon-stroke-width'>
                    <code>--icon-stroke-width</code>
                  </Link>
                </Table.HeaderCell>
                <Table.Cell>
                  1.7 / viewBox units, scales with icon size
                </Table.Cell>
                <Table.Cell>Round caps / joins</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>
          Don't make the icon itself the click target. Inside buttons, use flex
          alignment and the shared gap; inline, align icons to the text
          baseline. Keep the parent control's click target and focus ring when
          you change the icon size.
        </p>
      </section>
      <section id='library'>
        <h2>Shared vocabulary</h2>
        <p>
          The shared Icon currently provides {iconNames.length} shapes. To add a
          shape a product needs, add it to the shared source with a name and
          usage guidance, then test it. This list does not replace a full icon
          library.
        </p>
        <ul className='icon-gallery' aria-label='Shared icon vocabulary'>
          {iconNames.map((name) => (
            <li key={name}>
              <Icon name={name} size='md' />
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </section>
      <section id='semantics'>
        <h2>Names belong to meaning</h2>
        <p>
          An icon next to text is decorative by default. Give an icon-only
          button an aria-label that describes its action, and hide the SVG. A
          Tooltip does not replace the accessible name. For a meaningful
          standalone graphic, set decorative=false together with label.
        </p>
        <div className='actions'>
          <Button variant='outline' onClick={() => setCount((n) => n + 1)}>
            <Icon name='plus' />
            Increment preview
          </Button>
          <Button
            variant='outline'
            size='icon'
            aria-label='Reset preview'
            onClick={() => setCount(0)}
          >
            <Icon name='close' />
          </Button>
        </div>
        <p role='status'>Local count: {count}</p>
        <p className='icon-inline-example'>
          <Icon
            name='info'
            decorative={false}
            label='Supplementary information'
          />
          Example of a standalone icon with an explicit name.
        </p>
        <p>
          The button is the focusable element. Don't add tabIndex or a separate
          click behavior to the SVG. Show status with both an icon and text, and
          prefer <Link href='/components/badge'>StatusBadge</Link>.
        </p>
        <h3>Primitive contract</h3>
        <p>
          <code>name</code> takes a value from the shared list above.{' '}
          <code>size</code> is sm (the default, 16px), md, or lg, and{' '}
          <code>decorative</code> defaults to true. A meaningful standalone SVG
          sets <code>decorative=false</code> together with a non-empty{' '}
          <code>label</code>. The ref points to the SVGSVGElement, and you can
          compose it with className, style, and data attributes. If you override
          styles, recheck size, contrast, and direction.
        </p>
        <CodeBlock
          language='tsx'
          label='Accessible icon examples'
          code={
            'import { Icon, Button } from "@surflane/ui";\n\n<Button><Icon name="plus" />Add environment</Button>\n<Button size="icon" aria-label="Close details">\n  <Icon name="close" />\n</Button>\n<Icon name="info" decorative={false} label="Additional information" />'
          }
        />
      </section>
      <section id='direction'>
        <h2>Logical direction</h2>
        <p>
          Only the logical-direction icons, arrow-back and chevron-forward,
          mirror based on the DOM dir. Search, play, copy, external link, and
          expand-down icons don't mirror. For keyboard direction in Base UI
          controls, also set the product's DirectionProvider to the same
          direction.
        </p>
        <label>
          Preview direction
          <Select
            aria-label='Preview direction'
            value={direction}
            onValueChange={(value) => setDirection(value ?? 'ltr')}
            options={[
              { value: 'ltr', label: 'Left to right' },
              { value: 'rtl', label: 'Right to left' },
            ]}
          />
        </label>
        <div
          className='actions icon-direction-preview'
          dir={direction}
          data-icon-direction={direction}
        >
          <span>
            <Icon name='arrow-back' />
            Back
          </span>
          <span>
            Next
            <Icon name='chevron-forward' />
          </span>
          <span>
            <Icon name='external-link' />
            External link
          </span>
        </div>
        <p>
          Static markers for comparing direction. The labels above don't
          navigate anywhere.
        </p>
      </section>
      <section id='application'>
        <h2>Icon implementation rules</h2>
        <ul>
          <li>
            Use the same symbol for the same action, and keep the status name on
            result states.
          </li>
          <li>
            Include the target and the action in an icon button's accessible
            name. Don't shrink the hit area when you make the icon smaller.
          </li>
          <li>
            Use the code copy and external link symbols consistently. The
            wording and link purpose must be clear even when the SVG isn't
            visible.
          </li>
        </ul>
        <p>
          Color follows the parent's currentColor. Don't force-override the
          user's high-contrast colors, and check that required symbols have
          enough contrast against the adjacent background. Don't distinguish
          states by color alone.
        </p>
        <p>
          <a href='https://design-system.w3.org/styles/svg-icons.html'>
            W3C — SVG icons
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/tutorials/images/functional/'>
            WAI — Functional images
          </a>
          {' / '}
          <Link href='/foundations/color'>Color and contrast</Link>
        </p>
        <p>
          This page covers the shared primitive and guidance added so far. It
          does not mean that every existing product and component SVG has been
          migrated to this API.
        </p>
      </section>
    </>
  )
}
