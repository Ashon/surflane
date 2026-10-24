import {
  Badge,
  Button,
  Heading,
  Icon,
  Inline,
  Stack,
  Surface,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const tags = ['production', 'eu-west-1', 'node 22', 'arm64', 'canary']

export const Gaps = () => (
  <Stack gap={4}>
    {([1, 2, 4] as const).map((gap) => (
      <Stack gap={1} key={gap}>
        <Text as='span' variant='caption' color='muted'>
          gap={gap} · {gap * 4}px
        </Text>
        <Inline gap={gap}>
          {tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </Inline>
      </Stack>
    ))}
  </Stack>
)

export const Justify = () => (
  <Stack gap={3}>
    {(['start', 'between', 'end'] as const).map((justify) => (
      <Surface padding={3} key={justify}>
        <Inline gap={2} justify={justify}>
          <Text as='span' variant='label'>
            justify={justify}
          </Text>
          <Button variant='outline' size='small'>
            Cancel
          </Button>
          <Button variant='primary' size='small'>
            Save
          </Button>
        </Inline>
      </Surface>
    ))}
  </Stack>
)

export const Toolbar = () => (
  <Inline justify='between' gap={4}>
    <Inline gap={2}>
      <Heading level={3} size='section'>
        Deployments
      </Heading>
      <Badge tone='progress'>2 running</Badge>
    </Inline>
    <Inline gap={2}>
      <Button variant='ghost'>
        <Icon name='sort' />
        Sort
      </Button>
      <Button variant='primary'>
        <Icon name='plus' />
        New deployment
      </Button>
    </Inline>
  </Inline>
)
