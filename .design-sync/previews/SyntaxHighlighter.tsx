import { SyntaxHighlighter } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// Token colors come from the SyntaxHighlighting provider (shiki), which this
// preview bundle does not load: the source renders plain, as it does before the
// engine arrives or for an unsupported language.

const query = `SELECT service, region, percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95
FROM requests
WHERE observed_at > now() - interval '1 hour'
GROUP BY service, region
ORDER BY p95 DESC;
`

export const Block = () => (
  <SyntaxHighlighter
    code={query}
    language='sql'
    label='Slowest services query'
  />
)

const command = `# Scale the worker before the nightly billing run
kubectl --context prod-eu-west-2 --namespace payments scale deployment/billing-worker --replicas=8
`

// A narrow column shows the difference: by default long lines scroll inside the
// block; wrap breaks them visually without changing the source.
export const LongLinesScroll = () => (
  <div style={{ maxWidth: 400 }}>
    <SyntaxHighlighter code={command} language='bash' label='Scale command' />
  </div>
)

export const LongLinesWrap = () => (
  <div style={{ maxWidth: 400 }}>
    <SyntaxHighlighter
      code={command}
      language='bash'
      label='Scale command'
      wrap
    />
  </div>
)
