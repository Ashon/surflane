import { Markdown } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const runbook = `# Roll back checkout-api

Use this runbook when the **5xx error rate** stays above 2% for five minutes after a release. The service owner is \`platform-core\`; page them in [#oncall-payments](#).

> Roll back first, investigate second. A rollback takes under three minutes.

## Before you start

- [x] Confirm the alert in the error-rate dashboard
- [x] Note the failing version from the deploy log
- [ ] Tell #incidents that a rollback is under way
`

export const Runbook = () => (
  <Markdown source={runbook} label='Rollback runbook' />
)

const steps = `## Regions

| Region | Current | Previous | Replicas |
| :--- | :--- | :--- | ---: |
| us-east-1 | v2.14.0 | v2.13.2 | 6 |
| eu-west-2 | v2.14.0 | v2.13.2 | 4 |

## Steps

1. Pause the release pipeline.
2. Roll each region back to the previous version:

\`\`\`bash
deployctl rollback checkout-api --region us-east-1 --to v2.13.2
\`\`\`
`

export const TableAndCode = () => (
  <Markdown source={steps} label='Rollback steps' />
)

// Release notes sit under a page's h2, so their top heading starts at h3.
const notes = `# v2.14.0

Released October 24 to production in **us-east-1** and **eu-west-2**.

- Retries for card authorization now back off exponentially.
- The \`/healthz\` endpoint reports the database pool size.
- ~~Legacy receipts endpoint~~ removed; use \`/v2/receipts\`.[^1]

[^1]: Clients on the v1 SDK were migrated in September.
`

export const ReleaseNotes = () => (
  <Markdown source={notes} label='Release notes' headingLevel={3} />
)
