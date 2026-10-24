import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import type { Route } from './+types/root'
import './surflane.css'

// Resolve the theme in a loader (for example from a cookie) to avoid a flash.
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' data-theme='light'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='surf-typography'>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'An unexpected error occurred.'
  return (
    <main>
      <h1>Error</h1>
      <p>{message}</p>
    </main>
  )
}
