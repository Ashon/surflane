import { Tree } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const repository = [
  {
    id: 'services',
    label: 'services',
    children: [
      {
        id: 'checkout-api',
        label: 'checkout-api',
        children: [
          { id: 'checkout-dockerfile', label: 'Dockerfile' },
          { id: 'checkout-deploy', label: 'deploy.yaml' },
          { id: 'checkout-main', label: 'main.go' },
        ],
      },
      {
        id: 'billing-worker',
        label: 'billing-worker',
        children: [{ id: 'billing-main', label: 'main.go' }],
      },
      {
        id: 'search-indexer',
        label: 'search-indexer',
        children: [{ id: 'search-main', label: 'index.ts' }],
      },
    ],
  },
  {
    id: 'infra',
    label: 'infra',
    children: [
      {
        id: 'terraform',
        label: 'terraform',
        children: [{ id: 'tf-main', label: 'main.tf' }],
      },
      { id: 'alerts', label: 'alerts.yaml' },
    ],
  },
  { id: 'readme', label: 'README.md' },
]

export const Files = () => (
  <Tree
    nodes={repository}
    label='Repository files'
    defaultExpandedIds={['services', 'checkout-api']}
    defaultSelectedIds={['checkout-deploy']}
    height={440}
  />
)

const regions = [
  {
    id: 'us-east-1',
    label: 'us-east-1',
    children: [
      { id: 'use1-checkout', label: 'checkout-api' },
      { id: 'use1-billing', label: 'billing-worker' },
      { id: 'use1-search', label: 'search-indexer' },
    ],
  },
  {
    id: 'eu-west-2',
    label: 'eu-west-2',
    children: [
      { id: 'euw2-checkout', label: 'checkout-api' },
      {
        id: 'euw2-billing',
        label: 'billing-worker (frozen for audit)',
        disabled: true,
      },
    ],
  },
  {
    id: 'ap-northeast-2',
    label: 'ap-northeast-2',
    children: [{ id: 'apne2-checkout', label: 'checkout-api' }],
  },
]

export const MultipleSelection = () => (
  <Tree
    nodes={regions}
    label='Services by region'
    selectionMode='multiple'
    defaultExpandedIds={['us-east-1', 'eu-west-2']}
    defaultSelectedIds={['use1-checkout', 'euw2-checkout']}
    height={400}
  />
)

export const Small = () => (
  <Tree
    nodes={repository}
    label='Repository files'
    size='small'
    defaultExpandedIds={['infra', 'terraform']}
    height={240}
  />
)

export const Empty = () => (
  <Tree
    nodes={[]}
    label='Feature flags'
    labels={{ empty: 'No feature flags in this project yet.' }}
    height={120}
  />
)
