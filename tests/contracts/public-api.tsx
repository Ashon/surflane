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
} from '@surflane/ui'
import { Button as DirectButton } from '@surflane/ui/button'
import { Input as DirectInput } from '@surflane/ui/input'
import { Select as DirectSelect } from '@surflane/ui/select'
import {
  Dialog as DirectDialog,
  DialogContent as DirectDialogContent,
} from '@surflane/ui/dialog'
const variants: ButtonVariant[] = [
  'primary',
  'default',
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
  'sm',
  'md',
  'lg',
  'xs',
  'icon',
  'icon-xs',
  'icon-sm',
  'icon-lg',
]
variants.forEach((variant) => <DirectButton variant={variant} />)
sizes.forEach((size) => <Button size={size} />)
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
