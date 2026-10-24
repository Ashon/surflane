import { Combobox, Field } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const environments = [
  'production-us-east',
  'production-eu-central',
  'staging-web',
  'staging-api',
  'preview-pr-1284',
  'sandbox-legacy',
]

const roles = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'deployer', label: 'Deployer' },
  { value: 'operator', label: 'Operator' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'admin', label: 'Admin' },
]

const environmentList = (
  <Combobox.Content>
    <Combobox.Empty>No matching environments.</Combobox.Empty>
    <Combobox.List>
      {(environment: string) => (
        <Combobox.Item
          key={environment}
          value={environment}
          disabled={environment === 'sandbox-legacy'}
        >
          <Combobox.ItemIndicator />
          {environment}
        </Combobox.Item>
      )}
    </Combobox.List>
  </Combobox.Content>
)

export const Default = () => (
  <Field.Root name='environment'>
    <Field.Label>Target environment</Field.Label>
    <Combobox.Root
      items={environments}
      name='environment'
      defaultValue='staging-web'
      defaultOpen
    >
      <Combobox.InputGroup>
        <Combobox.Input placeholder='Search environments…' />
        <Combobox.Clear />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      {environmentList}
    </Combobox.Root>
  </Field.Root>
)

export const Selected = () => (
  <Field.Root name='environment'>
    <Field.Label>Target environment</Field.Label>
    <Combobox.Root
      items={environments}
      name='environment'
      defaultValue='production-eu-central'
    >
      <Combobox.InputGroup>
        <Combobox.Input placeholder='Search environments…' />
        <Combobox.Clear />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      {environmentList}
    </Combobox.Root>
    <Field.Description>
      Deploys go to every node in the environment.
    </Field.Description>
  </Field.Root>
)

export const MultipleChips = () => (
  <Field.Root name='roles'>
    <Field.Label>Roles for ops-oncall</Field.Label>
    <Combobox.Root
      items={roles}
      name='roles'
      multiple
      defaultValue={[roles[1], roles[2]]}
    >
      <Combobox.InputGroup>
        <Combobox.Chips>
          <Combobox.Value>
            {(selected: typeof roles) =>
              selected.map((role) => (
                <Combobox.Chip key={role.value}>
                  {role.label}
                  <Combobox.ChipRemove aria-label={`Remove ${role.label}`} />
                </Combobox.Chip>
              ))
            }
          </Combobox.Value>
          <Combobox.Input placeholder='Search roles…' />
        </Combobox.Chips>
        <Combobox.Trigger aria-label='Show roles' />
      </Combobox.InputGroup>
      <Combobox.Content>
        <Combobox.Empty>No matching roles.</Combobox.Empty>
        <Combobox.List>
          {(role: (typeof roles)[number]) => (
            <Combobox.Item key={role.value} value={role}>
              <Combobox.ItemIndicator />
              {role.label}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Content>
    </Combobox.Root>
  </Field.Root>
)

export const NoMatches = () => (
  <Field.Root name='environment'>
    <Field.Label>Target environment</Field.Label>
    <Combobox.Root
      items={environments}
      name='environment'
      defaultInputValue='payments'
      defaultOpen
    >
      <Combobox.InputGroup>
        <Combobox.Input placeholder='Search environments…' />
        <Combobox.Clear />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      {environmentList}
    </Combobox.Root>
  </Field.Root>
)

export const Disabled = () => (
  <Field.Root name='environment' disabled>
    <Field.Label>Target environment</Field.Label>
    <Combobox.Root
      items={environments}
      name='environment'
      defaultValue='production-us-east'
      disabled
    >
      <Combobox.InputGroup>
        <Combobox.Input placeholder='Search environments…' />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      {environmentList}
    </Combobox.Root>
    <Field.Description>Locked during the release freeze.</Field.Description>
  </Field.Root>
)
