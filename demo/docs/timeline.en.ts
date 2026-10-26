import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    "Show events in time order, such as a deploy history, an audit log or a job's steps: an ordered list, named with aria-label. Each Item is one event, marked with its tone's icon.",
    "In an Item, Title says what happened and Time when, in a time element with dateTime; Status names its state in words, in the tone's ink, and Description adds who or how long. Write them in that order, so a screen reader hears what, when and how it ended.",
    'There is no connecting line: the icon column carries the sequence. current puts the step where a sequence is now on the recessed plane and announces it as the current step.',
    'Detail holds logs, a diff or a list of changes behind a disclosure; open, it sits on the recessed plane, with its label in line with the title.',
  ],
  avoid: [
    "Don't use a timeline for records the reader sorts or filters; use a Table.",
    "Don't let colour or the icon carry the state alone. Write it in Status.",
    "Don't write relative times alone, such as 5 minutes ago; keep the absolute instant in dateTime and in the text or a title.",
  ],
  keyboard: [
    "The list takes no focus. Tab reaches each Detail's disclosure and the links inside events.",
    'Enter or Space opens and closes a Detail.',
  ],
  anatomy:
    'Root(ol) → Item(li: mark + body) → Title, Time(time), Status, Description, Detail(Collapsible)',
  tokens: [
    '--surf-recessed',
    '--surf-ink',
    '--surf-ink-muted',
    '--surf-status-success-fg',
    '--surf-status-danger-fg',
    '--surf-space-2',
  ],
  code: `import { Timeline } from '@surflane/ui'

<Timeline.Root aria-label='Deploy history'>
  <Timeline.Item tone='success'>
    <Timeline.Title>platform-api 1.42.0 to production</Timeline.Title>
    <Timeline.Time dateTime='2026-10-26T09:42:00Z'>09:42 UTC</Timeline.Time>
    <Timeline.Status>Succeeded</Timeline.Status>
    <Timeline.Description>by Mina Park, 3 min 12 s</Timeline.Description>
    <Timeline.Detail summary='3 changes'>…</Timeline.Detail>
  </Timeline.Item>
  <Timeline.Item tone='progress' current>
    <Timeline.Title>Canary rollout to 25%</Timeline.Title>
    <Timeline.Time dateTime='2026-10-26T09:38:00Z'>09:38 UTC</Timeline.Time>
    <Timeline.Status>Running</Timeline.Status>
  </Timeline.Item>
</Timeline.Root>`,
  props: [
    ['Root.size', 'small | default | large', 'surrounding'],
    [
      'Item.tone',
      'neutral | info | success | danger | caution | progress',
      'neutral',
    ],
    ['Item.icon', "a mark in place of the tone's icon, such as a Spinner", '—'],
    [
      'Item.current',
      'the step where the sequence is now: recessed plane, aria-current=step',
      'false',
    ],
    ['Time.dateTime', 'the machine-readable instant', 'required'],
    [
      'Detail.summary / defaultOpen / open / onOpenChange',
      "the disclosure's label and state, as on Collapsible",
      'required / false',
    ],
  ],
}
