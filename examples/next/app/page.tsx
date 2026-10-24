// A Server Component: Surflane parts render here without a "use client" wrapper.
import { SurflaneDemo } from './surflane-demo'
import { ServerSummary } from './server-summary'

export default function Home() {
  return (
    <>
      <SurflaneDemo framework='Next.js' />
      <ServerSummary />
    </>
  )
}
