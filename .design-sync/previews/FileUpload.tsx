import { FileUpload, Form, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const file = (name: string, bytes: number, type: string) =>
  new File([new Uint8Array(bytes)], name, { type, lastModified: 1761264000000 })

// A stand-in transport: the preview never sends a file anywhere.
const transport = async () => {}

export const Default = () => (
  <Stack style={{ maxWidth: '32rem' }}>
    <FileUpload
      name='artifacts'
      label='Build artifacts'
      description='Up to three JSON files, 1 MB each.'
      accept='.json,application/json'
      multiple
      maxFiles={3}
      maxFileSize={1024 * 1024}
      transport={transport}
    />
  </Stack>
)

export const WithFiles = () => (
  <Stack style={{ maxWidth: '32rem' }}>
    <FileUpload
      name='artifacts'
      label='Build artifacts'
      description='Up to three JSON files, 1 MB each.'
      accept='.json,application/json'
      multiple
      maxFiles={3}
      maxFileSize={1024 * 1024}
      defaultFiles={[
        file('build-manifest.json', 48_210, 'application/json'),
        file('sbom.cyclonedx.json', 312_400, 'application/json'),
      ]}
      transport={transport}
    />
  </Stack>
)

export const SingleFile = () => (
  <Stack style={{ maxWidth: '32rem' }}>
    <FileUpload
      name='envFile'
      label='Environment variables'
      description='A .env file for the staging environment.'
      accept='.env,text/plain'
      defaultFiles={[file('staging.env', 1_840, 'text/plain')]}
      labels={{ choose: 'Choose file', drop: 'or drop it here' }}
    />
  </Stack>
)

export const ServerError = () => (
  <Form
    style={{ maxWidth: '32rem' }}
    errors={{
      certificate:
        'The certificate expired on 2026-09-30. Upload a renewed one.',
    }}
  >
    <FileUpload
      name='certificate'
      label='TLS certificate'
      description='PEM-encoded, including the full chain.'
      accept='.pem,.crt'
      required
      defaultFiles={[
        file('checkout-api.example.pem', 5_312, 'application/x-pem-file'),
      ]}
      labels={{ choose: 'Choose file', drop: 'or drop it here' }}
    />
  </Form>
)

export const Disabled = () => (
  <Stack style={{ maxWidth: '32rem' }}>
    <FileUpload
      name='backup'
      label='Database backup'
      description='Restores are paused while a migration runs.'
      accept='.sql,.gz'
      disabled
    />
  </Stack>
)
