import { Prose } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const ReleaseNote = () => (
  <Prose>
    <h2>checkout-api 2.14.0</h2>
    <p>
      This release moves payment capture to the new queue and shortens cold
      starts. It is <strong>backwards compatible</strong> with 2.13 clients.
    </p>
    <h3>What changed</h3>
    <ul>
      <li>
        Payment capture now runs on <code>payments-queue</code> instead of the
        request thread.
      </li>
      <li>Cold starts are about 40% faster on arm64 runners.</li>
      <li>
        The <code>CHECKOUT_TIMEOUT_MS</code> default rose from 5000 to 8000.
      </li>
    </ul>
    <h3>Upgrade</h3>
    <p>
      Redeploy with <code>surf deploy checkout-api --tag 2.14.0</code>, then
      follow the <a href='#rollback'>rollback runbook</a> if error rates rise.
    </p>
  </Prose>
)

export const Runbook = () => (
  <Prose>
    <h3>Rotate registry credentials</h3>
    <p>Run these steps before the current token expires.</p>
    <ol>
      <li>Create a new token in the registry console.</li>
      <li>
        Store it as the <code>REGISTRY_TOKEN</code> workspace secret.
      </li>
      <li>Redeploy every service that pulls private images.</li>
    </ol>
    <pre>
      <code>surf secrets set REGISTRY_TOKEN --from-stdin</code>
    </pre>
    <p>
      <strong>Note:</strong> old tokens stop working 24 hours after a new one is
      issued.
    </p>
  </Prose>
)
