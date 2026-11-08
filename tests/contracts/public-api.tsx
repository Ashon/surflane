import {
  Button,
  type ButtonVariant,
  type ButtonSize,
  Input,
  Select,
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  type PaginationLabels,
  type CodeBlockLabels,
  type AppShellSidebarToggleLabels,
  type AppShellBrandProps,
  type AppShellNavProps,
  type AppShellLinkProps,
  type AppShellMenuTriggerProps,
  AppShell,
  Stat,
  type StatStatusProps,
  type StatGroupProps,
  BottomNavigation,
  type FileUploadLabels,
  Avatar,
  Card,
  Grid,
  categoryFor,
  type AvatarCategory,
} from '@surflane/ui'
import type { TreeLabels } from '@surflane/ui/tree'
import type { MarkdownLabels } from '@surflane/ui/markdown'
import {
  AreaChart,
  BarChart,
  LineChart,
  type ChartBaseProps,
  type ChartLabels,
} from '@surflane/ui/chart'
import { Button as DirectButton } from '@surflane/ui/button'
import { Input as DirectInput } from '@surflane/ui/input'
import { Select as DirectSelect } from '@surflane/ui/select'
import {
  Dialog as DirectDialog,
  DialogContent as DirectDialogContent,
} from '@surflane/ui/dialog'
const variants: ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
]
const sizes: ButtonSize[] = [
  'small',
  'default',
  'large',
  'icon',
  'icon-small',
  'icon-large',
]
// The short spellings were removed in 0.13.
// @ts-expect-error sm is no longer a size
;<Button size='sm' />
// @ts-expect-error variant='default' is now primary
;<Button variant='default' />
variants.forEach((variant) => <DirectButton variant={variant} />)
sizes.forEach((size) => <Button size={size} />)
// Text a component shows or names can be replaced, typed per component.
const labels:
  | [
      PaginationLabels,
      CodeBlockLabels,
      AppShellSidebarToggleLabels,
      TreeLabels,
      MarkdownLabels,
      ChartLabels,
      FileUploadLabels,
    ]
  | undefined = undefined
void labels
// Each chart takes only the props its marks read.
const chart: ChartBaseProps = {
  title: 'Runs',
  description: 'Runs a day.',
  data: [],
  series: [{ key: 'runs', label: 'Runs' }],
  unit: 'runs',
  xLabel: 'Day',
  yLabel: 'Runs',
}
;<LineChart {...chart} includeZero={false} yScale='log' curve='step' />
;<AreaChart {...chart} stacked curve='step' dashes={false} />
;<BarChart {...chart} stacked />
// @ts-expect-error A line doesn't stack.
;<LineChart {...chart} stacked />
// @ts-expect-error An area's fill is an amount: it rises from zero.
;<AreaChart {...chart} includeZero={false} />
// @ts-expect-error A bar's length is an amount, and a log axis has no zero.
;<BarChart {...chart} yScale='log' />
// @ts-expect-error A bar has no line to step or dash.
;<BarChart {...chart} curve='step' />
// @ts-expect-error Unsupported visual priority must fail for root imports.
const typo = <Button variant='primray' />
// @ts-expect-error Subpath imports expose the same contract.
const directTypo = <DirectButton variant='primray' />
// @ts-expect-error Unsupported dimensions must fail.
const sizeTypo = <Button size='huge' />
// Component refactors must preserve identical public types.
const compatible: [typeof Input, typeof Select, typeof Dialog] = [
  DirectInput,
  DirectSelect,
  DirectDialog,
]
void compatible
// Flat names are the Server Component form of namespace parts.
const flat: [
  typeof Dialog.Root,
  typeof Dialog.Trigger,
  typeof Dialog.Content,
  typeof Dialog.Title,
] = [DialogRoot, DialogTrigger, DirectDialogContent, DialogTitle]
void flat
const serverMarkup = (
  <DialogRoot>
    <DialogTrigger render={<Button variant='outline' />}>Open</DialogTrigger>
    <DialogContent>
      <DialogTitle>Title</DialogTitle>
    </DialogContent>
  </DialogRoot>
)
void serverMarkup
// AppShell's brand, groups and rows: a router link or a menu trigger renders a row.
const brand: AppShellBrandProps = {
  name: 'Harbor',
  description: 'Port of Busan',
}
const group: AppShellNavProps = { label: 'Berths' }
const row: AppShellLinkProps = {
  label: 'Account',
  icon: null,
  render: <button />,
}
const shellParts = (
  <AppShell.Nav {...group}>
    <AppShell.Brand {...brand} render={<a href='/' />} />
    <AppShell.Link {...row} />
  </AppShell.Nav>
)
void shellParts
// The phone menu trigger renders into the caller's Sheet.Trigger.
const menuTrigger: AppShellMenuTriggerProps = { label: 'Open navigation' }
const phoneMenu = (
  <AppShell.Header>
    <AppShell.MenuTrigger {...menuTrigger} />
  </AppShell.Header>
)
void phoneMenu
// A threshold state and a group of values; a badge colored by meaning.
const status: StatStatusProps = { tone: 'danger', children: 'Below 30 GiB' }
const statGroup: StatGroupProps = { label: 'GPU temperature' }
const dashboardParts = (
  <Stat.Group {...statGroup}>
    <Stat.Root>
      <Stat.Label>dgx-001</Stat.Label>
      <Stat.Value>24 GiB</Stat.Value>
      <Stat.Status {...status} />
    </Stat.Root>
    <BottomNavigation.Item
      icon={null}
      label='Runs'
      badge
      badgeLabel='needs a look'
      badgeTone='caution'
    />
    <Select options={[]} width='content' />
  </Stat.Group>
)
void dashboardParts
// @ts-expect-error A status needs its tone.
const tonelessStatus = <Stat.Status>Low</Stat.Status>
void tonelessStatus
// @ts-expect-error A brand needs its name.
const namelessBrand = <AppShell.Brand mark={<svg />} />
void namelessBrand
// A collection: an auto grid of cards that open their item, each with an
// identity, a live state and its counts.
const category: AvatarCategory = categoryFor('surflane')
const collection = (
  <Grid columns='auto' min='card'>
    <Card.Root>
      <Card.Header>
        <Avatar.Root category={category}>
          <Avatar.Fallback>S</Avatar.Fallback>
          <Avatar.Status tone='progress' live />
        </Avatar.Root>
        <Card.Title>
          <Card.Action onClick={() => {}}>Surflane</Card.Action>
        </Card.Title>
      </Card.Header>
      <Card.Footer>
        <Stat.Group label='Session counts' labelHidden size='small'>
          <Stat.Root size='small'>
            <Stat.Label>Turns</Stat.Label>
            <Stat.Value>532</Stat.Value>
          </Stat.Root>
        </Stat.Group>
      </Card.Footer>
    </Card.Root>
    <Card.Root>
      <Card.Title>
        <Card.Action href='/sessions/2'>Folio</Card.Action>
      </Card.Title>
    </Card.Root>
  </Grid>
)
void collection
// @ts-expect-error A column minimum belongs to an auto grid.
const fixedWithMin = <Grid columns={3} min='tile' />
void fixedWithMin
// @ts-expect-error The categories are the palette's twelve.
const thirteenth = <Avatar.Root category={13} />
void thirteenth
// @ts-expect-error A link action can't be disabled, as a button can.
const disabledLink = <Card.Action href='/a' disabled />
void disabledLink
