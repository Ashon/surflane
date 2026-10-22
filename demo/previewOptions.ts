import { createContext } from 'react'
import type { TableDensity } from '@surflane/ui'

/** The table density chosen in a preview's handle; table examples read it. */
export const PreviewDensityContext = createContext<TableDensity>('default')
