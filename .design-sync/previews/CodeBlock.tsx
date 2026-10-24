import { CodeBlock } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Command = () => (
  <CodeBlock
    label='Install'
    language='bash'
    code='npm install @surflane/ui @surflane/design-tokens @surflane/css @base-ui/react'
  />
)

const deployment = `# Rolled out by the release pipeline
name: checkout-api
environment: production
regions:
  - us-east-1
  - eu-west-2
replicas: 6
healthCheck:
  path: /healthz
  timeoutSeconds: 3
`

export const Config = () => (
  <CodeBlock label='Deployment manifest' language='yaml' code={deployment} />
)

const source = `import { StatusBadge } from '@surflane/ui'

export function DeployStatus({ healthy }: { healthy: boolean }) {
  return healthy
    ? <StatusBadge tone='success'>Healthy</StatusBadge>
    : <StatusBadge tone='danger'>Failing</StatusBadge>
}
`

export const Source = () => (
  <CodeBlock label='DeployStatus.tsx' language='tsx' code={source} />
)

const logLine =
  'curl -sS -H "Authorization: Bearer $DEPLOY_TOKEN" "https://deploy.internal.example/api/v2/services/checkout-api/deployments?environment=production&region=eu-west-2&limit=20&include=commits,approvals"\n'

export const Wrapped = () => (
  <CodeBlock
    label='List recent deployments'
    language='bash'
    code={logLine}
    wrap
  />
)
