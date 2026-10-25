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
} from '@surflane/ui'
import type { TreeLabels } from '@surflane/ui/tree'
import type { MarkdownLabels } from '@surflane/ui/markdown'
import type { ChartLabels } from '@surflane/ui/chart'
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
