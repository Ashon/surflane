import {
  Accordion,
  AlertDialog,
  AppShell,
  Autocomplete,
  Avatar,
  Badge,
  BottomNavigation,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  CodeBlock,
  Collapsible,
  Combobox,
  Container,
  ContextMenu,
  Dialog,
  DirectionProvider,
  Drawer,
  EmptyState,
  Field,
  Fieldset,
  FileUpload,
  FilterBar,
  Form,
  Grid,
  GridItem,
  Heading,
  Icon,
  Inline,
  InlineMessage,
  Input,
  Link,
  List,
  Menu,
  Menubar,
  Meter,
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  NavigationMenu,
  NumberField,
  OTPField,
  PageHeader,
  Pagination,
  Popover,
  PreviewCard,
  Progress,
  Prose,
  Radio,
  RadioGroup,
  ScrollArea,
  Select,
  Separator,
  Sheet,
  SizeProvider,
  Skeleton,
  Slider,
  Slot,
  Spinner,
  Stack,
  StatusBadge,
  Surface,
  Switch,
  SyntaxHighlighter,
  Table,
  Tabs,
  Text,
  Textarea,
  Toast,
  Toggle,
  ToggleGroup,
  Toolbar,
  Tooltip,
  TooltipProvider,
  Toaster,
  iconNames,
  syntaxLanguages,
  ChoiceLabel,
  LinkButton,
} from '@surflane/ui'
import { Chart, type ChartDatum } from '@surflane/ui/chart'
import {
  DateLocaleProvider,
  DatePicker,
  DateRangePicker,
  TimeField,
} from '@surflane/ui/date-picker'
import { Markdown } from '@surflane/ui/markdown'
import { SyntaxHighlighting } from '@surflane/ui/syntax-highlighting'
import { Tree, type TreeNode } from '@surflane/ui/tree'

// Fictional data for a harbor logistics workspace.
const berths = [
  { id: 'north-pier', name: 'North pier', cranes: 4, state: 'Ready' },
  { id: 'east-quay', name: 'East quay', cranes: 2, state: 'Maintenance' },
  { id: 'dry-dock', name: 'Dry dock', cranes: 1, state: 'Ready' },
]
const regions = ['North basin', 'East basin', 'Outer harbor', 'Inner canal']
const routes = ['Tidewater loop', 'Lantern ferry', 'Cargo express']
const shifts = [
  { value: 'dawn', label: 'Dawn shift' },
  { value: 'day', label: 'Day shift' },
  { value: 'night', label: 'Night shift', disabled: true },
]
const throughput: ChartDatum[] = [
  { id: 'mon', label: 'Monday', values: { north: 42, east: 18 } },
  { id: 'tue', label: 'Tuesday', values: { north: 47, east: null } },
  { id: 'wed', label: 'Wednesday', values: { north: 39, east: 24 } },
]
const manifest: TreeNode[] = [
  {
    id: 'vessels',
    label: 'Vessels',
    children: [
      { id: 'aurora', label: 'MV Aurora' },
      { id: 'kestrel', label: 'MV Kestrel' },
      { id: 'reserved', label: 'Reserved berth', disabled: true },
    ],
  },
  {
    id: 'warehouses',
    label: 'Warehouses',
    children: [{ id: 'w1', label: 'W1' }],
  },
]
const guide = `## Docking checklist

1. Confirm the **berth** assignment.
2. Notify the pilot boat.

| Step | Owner |
| ---- | ----- |
| Moor | Deck crew |

\`\`\`ts
const berth = assign("north-pier");
\`\`\`
`
const source = `export function eta(knots: number, miles: number) {
  return miles / knots;
}`

export function Foundations() {
  return (
    <section data-ssr='foundations'>
      <Container width='workspace'>
        <PageHeader
          as='header'
          title='Harbor operations'
          level={1}
          size='page'
          description='Berth assignments for the current tide window.'
          breadcrumb={
            <Breadcrumbs.Root aria-label='Workspace breadcrumb'>
              <Breadcrumbs.List>
                <Breadcrumbs.Item>
                  <Breadcrumbs.Link href='/harbor'>Harbor</Breadcrumbs.Link>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Breadcrumbs.Separator />
                  <Breadcrumbs.Current>Berths</Breadcrumbs.Current>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Breadcrumbs.Root>
          }
          actionsLabel='Berth actions'
          actions={<Button>Assign berth</Button>}
        />
        <Stack gap={4}>
          <Heading level={2} size='section'>
            Overview
          </Heading>
          <Text variant='body' color='secondary'>
            Three berths are scheduled today.
          </Text>
          <Inline gap={2} justify='between'>
            <Badge>3 berths</Badge>
            <StatusBadge tone='success'>Tide window open</StatusBadge>
            <StatusBadge tone='progress'>Unloading</StatusBadge>
          </Inline>
          <Grid columns={3} gap={4}>
            <GridItem span={4}>
              <Surface surface='subtle' padding={4}>
                <Text as='span' variant='metric'>
                  42
                </Text>
              </Surface>
            </GridItem>
          </Grid>
          <Prose>
            <p>Pilots board at the outer marker.</p>
          </Prose>
          <Separator inset />
          <Link href='/harbor/tides'>Tide tables</Link>
          <Slot className='ssr-slot'>
            <span>Slotted label</span>
          </Slot>
          <Inline gap={1}>
            {iconNames.map((name) => (
              <Icon key={name} name={name} size='default' />
            ))}
            <Icon name='settings' decorative={false} label='Settings' />
          </Inline>
        </Stack>
      </Container>
    </section>
  )
}

export function Controls() {
  return (
    <section data-ssr='controls'>
      <TooltipProvider>
        <Tooltip label='Recalculate arrival times' shortcut='⌘R'>
          <Button variant='outline'>Refresh ETA</Button>
        </Tooltip>
      </TooltipProvider>
      <Toaster label='Notifications' />
      <Button variant='destructive' size='small'>
        Release berth
      </Button>
      <LinkButton variant='outline' href='/berths'>
        Open berths
      </LinkButton>
      <Link render={<a href='/pilots' />}>Pilot roster</Link>
      <Input
        name='vessel'
        aria-label='Vessel name'
        placeholder='MV Aurora'
        leadingIcon={<Icon name='search' />}
      />
      <Select
        name='shift'
        aria-label='Shift'
        defaultValue='dawn'
        options={shifts}
      />
      <NativeSelect aria-label='Basin' name='basin' defaultValue='north'>
        <option value='north'>North basin</option>
        <option value='east'>East basin</option>
      </NativeSelect>
      <NativeSelect
        aria-label='Vessel class'
        name='class'
        defaultValue='feeder'
      >
        <NativeSelectOptGroup label='Container'>
          <NativeSelectOption value='feeder'>Feeder</NativeSelectOption>
          <NativeSelectOption value='panamax'>Panamax</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOption value='tug' disabled>
          Tug
        </NativeSelectOption>
      </NativeSelect>
      <Form>
        <Fieldset.Root>
          <Fieldset.Legend>Pilot request</Fieldset.Legend>
          <Field.Root name='pilot'>
            <Field.Label>Pilot name</Field.Label>
            <Field.Control required placeholder='R. Okafor' />
            <Field.Description>Shown on the boarding list.</Field.Description>
            <Field.Error />
          </Field.Root>
          <Field.Root name='notes'>
            <Field.Label>Notes</Field.Label>
            <Textarea rows={3} />
          </Field.Root>
        </Fieldset.Root>
        <ChoiceLabel
          description='The harbour office confirms within an hour.'
          control={
            <Checkbox.Root name='tug' defaultChecked size='small'>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          Request a tug
        </ChoiceLabel>
        <CheckboxGroup
          allValues={['north', 'east']}
          defaultValue={['north']}
          aria-label='Basins'
        >
          <label className='surf-choice-label'>
            <Checkbox.Root parent>
              <Checkbox.Indicator />
            </Checkbox.Root>
            <span>All basins</span>
          </label>
          {['north', 'east'].map((value) => (
            <label className='surf-choice-label' key={value}>
              <Checkbox.Root name='basins' value={value}>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <span>{value}</span>
            </label>
          ))}
        </CheckboxGroup>
        <RadioGroup name='priority' defaultValue='normal' aria-label='Priority'>
          {['normal', 'urgent'].map((value) => (
            <label className='surf-choice-label' key={value}>
              <Radio.Root value={value}>
                <Radio.Indicator />
              </Radio.Root>
              <span>{value}</span>
            </label>
          ))}
        </RadioGroup>
        <label className='surf-choice-label'>
          <Switch.Root name='alerts' defaultChecked>
            <Switch.Thumb />
          </Switch.Root>
          <span>Tide alerts</span>
        </label>
        <Field.Root name='crew'>
          <Field.Label>Crew size</Field.Label>
          <NumberField.Root name='crew' defaultValue={6} min={1} max={20}>
            <NumberField.Group>
              <NumberField.Decrement aria-label='Decrease crew' />
              <NumberField.Input />
              <NumberField.Increment aria-label='Increase crew' />
            </NumberField.Group>
          </NumberField.Root>
        </Field.Root>
        <Field.Root name='region'>
          <Field.Label>Basin</Field.Label>
          <Combobox.Root
            name='region'
            items={regions}
            defaultValue='North basin'
          >
            <Combobox.InputGroup>
              <Combobox.Input placeholder='Search basins…' />
              <Combobox.Clear aria-label='Clear basin' />
              <Combobox.Trigger aria-label='Show basins' />
            </Combobox.InputGroup>
            <Combobox.Content>
              <Combobox.Empty>No matching basins.</Combobox.Empty>
              <Combobox.List>
                {(region: string) => (
                  <Combobox.Item key={region} value={region}>
                    <Combobox.ItemIndicator />
                    {region}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Root>
        </Field.Root>
        <Field.Root name='route'>
          <Field.Label>Route</Field.Label>
          <Autocomplete.Root name='route' items={routes}>
            <Autocomplete.InputGroup>
              <Autocomplete.Input placeholder='Search routes…' />
              <Autocomplete.Clear aria-label='Clear route' />
              <Autocomplete.Trigger aria-label='Show routes' />
            </Autocomplete.InputGroup>
            <Autocomplete.Content>
              <Autocomplete.Empty>No suggestions.</Autocomplete.Empty>
              <Autocomplete.List>
                {(route: string) => (
                  <Autocomplete.Item key={route} value={route}>
                    {route}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Content>
          </Autocomplete.Root>
        </Field.Root>
        <Slider.Root name='cranes' defaultValue={3} min={1} max={8}>
          <Slider.Label>Active cranes</Slider.Label>
          <Slider.Value>{(_, values) => `${values[0]} cranes`}</Slider.Value>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb getAriaValueText={(_, value) => `${value} cranes`} />
          </Slider.Control>
        </Slider.Root>
        <Field.Root name='code'>
          <Field.Label>Gate code</Field.Label>
          <OTPField.Root length={4}>
            {Array.from({ length: 4 }, (_, index) => (
              <OTPField.Input
                key={index}
                aria-label={index === 0 ? undefined : `Digit ${index + 1} of 4`}
              />
            ))}
          </OTPField.Root>
        </Field.Root>
        <DateLocaleProvider locale='en-US'>
          <DatePicker label='Arrival date' name='arrival' />
          <DateRangePicker
            label='Berth window'
            startName='windowStart'
            endName='windowEnd'
          />
          <TimeField label='Pilot boarding' name='boarding' hourCycle={24} />
        </DateLocaleProvider>
        <FileUpload
          name='manifest'
          label='Cargo manifest'
          description='Up to two JSON files.'
          accept='.json,application/json'
          multiple
          maxFiles={2}
        />
        <Button type='submit'>Submit request</Button>
      </Form>
    </section>
  )
}

export function Commands() {
  return (
    <section data-ssr='commands'>
      <Toggle defaultPressed>Show tides</Toggle>
      <ToggleGroup
        multiple
        aria-label='Visible layers'
        defaultValue={['ships']}
      >
        <Toggle value='ships'>Ships</Toggle>
        <Toggle value='cranes'>Cranes</Toggle>
      </ToggleGroup>
      <Toolbar.Root aria-label='Berth tools'>
        <Toolbar.Group aria-label='Edit'>
          <Toolbar.Button>Refresh</Toolbar.Button>
          <Toolbar.Button render={<Toggle />}>Pin</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Input aria-label='Filter berths' />
        <Toolbar.Link href='/harbor/help'>Help</Toolbar.Link>
      </Toolbar.Root>
      <Menubar aria-label='Harbor commands' modal={false}>
        <Menu.Root>
          <Menu.Trigger>Berth</Menu.Trigger>
          <Menu.Portal>
            <Menu.Content align='start'>
              <Menu.Item>Assign</Menu.Item>
              <Menu.Item disabled>Decommission</Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu.Root>
      </Menubar>
      <Menu.Root>
        <Menu.Trigger render={<Button variant='outline' />}>
          Actions
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Content>
            <Menu.Item>Inspect</Menu.Item>
            <Menu.Separator />
            <Menu.CheckboxItem defaultChecked>
              <Menu.CheckboxItemIndicator />
              Follow vessel
            </Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Portal>
      </Menu.Root>
      <ContextMenu.Root>
        <ContextMenu.Trigger>Berth map</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content collisionPadding={12}>
            <ContextMenu.Item>Open berth</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <NavigationMenu.Root aria-label='Harbor products'>
        <NavigationMenu.List>
          <NavigationMenu.Item value='ops'>
            <NavigationMenu.Trigger>Operations</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href='/harbor/berths' active closeOnClick>
                Berths
              </NavigationMenu.Link>
              <NavigationMenu.Link href='/harbor/pilots' closeOnClick>
                Pilots
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href='/harbor/docs'>Docs</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Portal>
          <NavigationMenu.Positioner align='start' sideOffset={8}>
            <NavigationMenu.Popup aria-label='Operation destinations'>
              <NavigationMenu.Viewport />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>
    </section>
  )
}

export function Overlays() {
  return (
    <section data-ssr='overlays'>
      <Popover.Root>
        <Popover.Trigger render={<Button />}>Berth details</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>North pier</Popover.Title>
            <Popover.Description>Four cranes available.</Popover.Description>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Popover.Root defaultOpen>
        <Popover.Trigger render={<Button className='ssr-open-popover' />}>
          Open popover
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Title>East quay</Popover.Title>
            <Popover.Close render={<Button />}>Close</Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Dialog.Root>
        <Dialog.Trigger render={<Button />}>Open plan</Dialog.Trigger>
        <Dialog.Content closeLabel='Close plan'>
          <Dialog.Header>
            <Dialog.Title>Docking plan</Dialog.Title>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger render={<Button className='ssr-open-dialog' />}>
          Open dialog
        </Dialog.Trigger>
        <Dialog.Content closeLabel='Close plan'>
          <Dialog.Header>
            <Dialog.Title>Docking plan</Dialog.Title>
            <Dialog.Description>Preview only.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>MV Aurora berths at North pier.</Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button />}>Done</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger render={<Button variant='destructive' />}>
          Cancel docking
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Cancel docking?</AlertDialog.Title>
            <AlertDialog.Description>
              The pilot is notified.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button />}>
              Keep docking
            </AlertDialog.Close>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <Sheet.Root side='right' defaultOpen>
        <Sheet.Trigger render={<Button />}>Vessel</Sheet.Trigger>
        <Sheet.Content closeLabel='Close vessel'>
          <Sheet.Header>
            <Sheet.Title>MV Aurora</Sheet.Title>
            <Sheet.Description>Container feeder.</Sheet.Description>
          </Sheet.Header>
          <Sheet.Body>Draft 9.4 m</Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close render={<Button />}>Done</Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
      <Drawer.Root defaultOpen>
        <Drawer.Trigger render={<Button />}>Prepare mooring</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Mooring</Drawer.Title>
            <Drawer.Description>Lines and fenders.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>Six lines ready.</Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close render={<Button />}>Cancel</Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
      <PreviewCard.Root>
        <PreviewCard.Trigger href='/harbor/guides/mooring'>
          Mooring guide
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Content sideOffset={8}>
            <strong>Mooring guide</strong>
          </PreviewCard.Content>
        </PreviewCard.Portal>
      </PreviewCard.Root>
    </section>
  )
}

export function Disclosure() {
  return (
    <section data-ssr='disclosure'>
      <Tabs.Root defaultValue='overview'>
        <Tabs.List aria-label='Berth sections'>
          <Tabs.Tab value='overview'>Overview</Tabs.Tab>
          <Tabs.Tab value='crew'>Crew</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value='overview'>Overview details</Tabs.Panel>
        <Tabs.Panel value='crew' keepMounted>
          Crew roster
        </Tabs.Panel>
      </Tabs.Root>
      <Accordion.Root defaultValue={['safety']}>
        <Accordion.Item value='safety'>
          <Accordion.Header>
            <Accordion.Trigger>Safety checks</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Life rings inspected.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='weather'>
          <Accordion.Header>
            <Accordion.Trigger>Weather</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Light swell.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Technical details</Collapsible.Trigger>
        <Collapsible.Panel>Hull inspection logged.</Collapsible.Panel>
      </Collapsible.Root>
      <Avatar.Root role='img' aria-label='Harbor master' size='default'>
        <Avatar.Image src='/avatars/harbor-master.png' alt='' />
        <Avatar.Fallback aria-hidden='true'>HM</Avatar.Fallback>
      </Avatar.Root>
      <ScrollArea
        label='Berth log'
        orientation='vertical'
        style={{ maxHeight: 120 }}
      >
        <p>06:00 North pier cleared.</p>
        <p>06:40 MV Aurora alongside.</p>
      </ScrollArea>
    </section>
  )
}

export function Feedback() {
  return (
    <section data-ssr='feedback'>
      <Progress.Root value={30} aria-valuetext='30 of 100 containers unloaded'>
        <Progress.Label>Unloading</Progress.Label>
        <Progress.Value>
          {(formatted, value) => (value === null ? 'Waiting' : formatted)}
        </Progress.Value>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Meter.Root value={30} min={0} max={64} aria-valuetext='30 of 64 slots'>
        <Meter.Label>Yard capacity</Meter.Label>
        <Meter.Value>{(_, value) => `${value} / 64 slots`}</Meter.Value>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Spinner label='Syncing berths' />
      <Skeleton shape='block' />
      <InlineMessage.Root tone='danger'>
        <InlineMessage.Icon tone='danger' />
        <InlineMessage.Content>
          <InlineMessage.Title>Crane offline</InlineMessage.Title>
          <InlineMessage.Description>
            Crane 3 lost power at 05:12.
          </InlineMessage.Description>
          <InlineMessage.Actions>
            <Button>Retry</Button>
          </InlineMessage.Actions>
        </InlineMessage.Content>
      </InlineMessage.Root>
      <EmptyState.Root>
        <EmptyState.Icon>
          <Icon name='info' />
        </EmptyState.Icon>
        <EmptyState.Title>No delayed vessels</EmptyState.Title>
        <EmptyState.Description>
          All arrivals are on schedule.
        </EmptyState.Description>
        <EmptyState.Actions>
          <Button variant='outline'>View schedule</Button>
        </EmptyState.Actions>
      </EmptyState.Root>
      <Toast.Provider timeout={5000} limit={3}>
        <Toast.Portal>
          <Toast.Viewport aria-label='Notifications' />
        </Toast.Portal>
        <Toast.Viewport aria-label='Pinned notifications' layout='list'>
          <Toast.Root
            tone='success'
            toast={{
              id: 'berth-ready',
              title: 'Berth ready',
              description: 'North pier is clear.',
              type: 'success',
            }}
          >
            <Toast.Content>
              <Toast.Icon />
              <Toast.Text>
                <Toast.Title />
                <Toast.Description />
                <Toast.Action>Open</Toast.Action>
              </Toast.Text>
              <Toast.Close />
            </Toast.Content>
          </Toast.Root>
        </Toast.Viewport>
      </Toast.Provider>
    </section>
  )
}

export function Data() {
  return (
    <section data-ssr='data'>
      <Table.Container label='Berth comparison'>
        <Table.Root density='compact' stickyHeader>
          <Table.Caption>Berths</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.SortHeader sort='ascending' onSort={() => {}}>
                Name
              </Table.SortHeader>
              <Table.HeaderCell scope='col' numeric>
                Cranes
              </Table.HeaderCell>
              <Table.HeaderCell scope='col'>State</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {berths.map((berth) => (
              <Table.Row key={berth.id} selected={berth.id === 'north-pier'}>
                <Table.HeaderCell scope='row'>
                  <Table.Truncate>{berth.name}</Table.Truncate>
                </Table.HeaderCell>
                <Table.Cell numeric>{berth.cranes}</Table.Cell>
                <Table.Cell>{berth.state}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Body>
            <Table.Message colSpan={3}>No other berths are open.</Table.Message>
          </Table.Body>
          <Table.Foot>
            <Table.Row>
              <Table.HeaderCell scope='row'>Total</Table.HeaderCell>
              <Table.Cell>7</Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Foot>
        </Table.Root>
      </Table.Container>
      <List.Root aria-label='Berths'>
        {berths.map((berth) => (
          <List.Item key={berth.id}>
            <List.Content>
              <List.Title>{berth.name}</List.Title>
              <List.Description>{berth.cranes} cranes</List.Description>
            </List.Content>
            <List.Actions>
              <Button variant='outline'>Inspect {berth.name}</Button>
            </List.Actions>
          </List.Item>
        ))}
      </List.Root>
      <Card.Root aria-labelledby='ssr-card-title'>
        <Card.Header>
          <Card.Title id='ssr-card-title' level={3}>
            North pier
          </Card.Title>
          <Card.Description>Deep-water berth</Card.Description>
        </Card.Header>
        <Card.Body>Four cranes are ready.</Card.Body>
        <Card.Footer>
          <Button>Inspect berth</Button>
        </Card.Footer>
      </Card.Root>
      <Pagination
        page={2}
        pageCount={10}
        getPageHref={(page) => `/harbor/arrivals?page=${page}`}
        aria-label='Arrival pages'
      />
      <FilterBar.Root label='Filter berths'>
        <FilterBar.Controls>
          <FilterBar.Field width='search'>
            Search
            <Input type='search' name='q' defaultValue='pier' />
          </FilterBar.Field>
          <FilterBar.Field>
            Shift
            <Select
              aria-label='Shift filter'
              defaultValue='day'
              options={shifts}
            />
          </FilterBar.Field>
          <FilterBar.Actions>
            <Button type='reset'>Clear filters</Button>
          </FilterBar.Actions>
        </FilterBar.Controls>
        <FilterBar.Summary>3 results</FilterBar.Summary>
      </FilterBar.Root>
      <Tree
        nodes={manifest}
        label='Manifest'
        height={240}
        defaultExpandedIds={['vessels']}
        defaultSelectedIds={['aurora']}
        selectionMode='multiple'
      />
      <Tree nodes={manifest} label='Manifest (static)' virtualized={false} />
      <Chart
        title='Containers moved'
        description='North pier moved 42, 47 and 39 containers; East quay did not report on Tuesday.'
        xLabel='Day'
        yLabel='Containers'
        unit='containers'
        data={throughput}
        series={[
          { key: 'north', label: 'North pier' },
          { key: 'east', label: 'East quay' },
        ]}
        type='line'
      />
      <Chart
        title='Containers by berth'
        description='Bar view of the same week.'
        xLabel='Day'
        yLabel='Containers'
        unit='containers'
        data={throughput}
        series={[{ key: 'north', label: 'North pier' }]}
        type='bar'
      />
    </section>
  )
}

export function Content() {
  return (
    <section data-ssr='content'>
      <CodeBlock
        label='Berth task'
        language='YAML'
        code={'berth: north-pier\ncranes: 4\n'}
      />
      <SyntaxHighlighter code={source} language='tsx' label='ETA helper' />
      {syntaxLanguages.map((language) => (
        <SyntaxHighlighter
          key={language}
          code='assign()'
          language={language}
          inline
        />
      ))}
      <Markdown source={guide} label='Docking guide' headingLevel={2} />
    </section>
  )
}

// With suspense, the server waits for the tokens and renders the code highlighted.
export function Highlighted() {
  return (
    <section data-ssr='highlighted'>
      <SyntaxHighlighting suspense>
        <SyntaxHighlighter
          code={source}
          language='tsx'
          label='Highlighted ETA helper'
          className='ssr-highlighted'
        />
      </SyntaxHighlighting>
    </section>
  )
}

export function Shell() {
  return (
    <section data-ssr='shell'>
      <AppShell.Root layout='workspace'>
        <AppShell.Header>
          <AppShell.Brand name='Harbor' />
        </AppShell.Header>
        <AppShell.Sidebar aria-label='Workspace'>
          <AppShell.Brand
            name='Harbor'
            description='Port of Busan'
            render={<a href='/harbor' />}
          />
          <AppShell.Nav label='Workspace'>
            <AppShell.Link
              href='/harbor/berths'
              label='Berths'
              icon={<Icon name='menu' />}
              aria-current='page'
            />
          </AppShell.Nav>
          <AppShell.Footer>
            <AppShell.Link
              render={<button type='button' />}
              label='Harbor master'
              icon={<Icon name='info' />}
            />
          </AppShell.Footer>
        </AppShell.Sidebar>
        <AppShell.Content>
          <ScrollArea orientation='vertical' label='Workspace content'>
            <AppShell.Page>
              <Text>Workspace body</Text>
            </AppShell.Page>
          </ScrollArea>
        </AppShell.Content>
      </AppShell.Root>
      <BottomNavigation.Root aria-label='Harbor'>
        <BottomNavigation.Item
          href='/harbor/berths'
          icon={<Icon name='menu' />}
          label='Berths'
          current
        />
        <BottomNavigation.Item
          href='/harbor/arrivals'
          icon={<Icon name='clock' />}
          label='Arrivals'
          badge={120}
          badgeLabel='120 waiting'
        />
      </BottomNavigation.Root>
    </section>
  )
}

/** Every root export in its initial state; overlays include a defaultOpen variant. */
export function SsrFixture() {
  return (
    <DirectionProvider direction='ltr'>
      <SizeProvider size='default'>
        <Foundations />
        <Controls />
        <Commands />
        <Overlays />
        <Disclosure />
        <Feedback />
        <Data />
        <Content />
        <Highlighted />
        <Shell />
      </SizeProvider>
    </DirectionProvider>
  )
}
