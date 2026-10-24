// The package on its own: the built @surflane/ui with only its own stylesheet and the
// fonts it is designed for. No catalog CSS, so a rule the catalog adds cannot hide a
// package bug. ?section= picks one fixture section and ?theme= the theme.
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
import '@surflane/ui/all.css'
import { createRoot } from 'react-dom/client'
import { DirectionProvider, SizeProvider } from '@surflane/ui'
import {
  Commands,
  Content,
  Controls,
  Data,
  Disclosure,
  Feedback,
  Foundations,
  Highlighted,
  Overlays,
  Shell,
} from '../ssr/fixture'

const sections = {
  foundations: Foundations,
  controls: Controls,
  commands: Commands,
  overlays: Overlays,
  disclosure: Disclosure,
  feedback: Feedback,
  data: Data,
  content: Content,
  highlighted: Highlighted,
  shell: Shell,
}
const params = new URLSearchParams(location.search)
const theme = params.get('theme')
if (theme === 'dark' || theme === 'light')
  document.documentElement.dataset.theme = theme
const Section = sections[params.get('section') as keyof typeof sections]
document.body.className = 'surf-typography'

createRoot(document.getElementById('root')!).render(
  <DirectionProvider direction='ltr'>
    <SizeProvider size='default'>
      {Section ? (
        <Section />
      ) : (
        <ul>
          {Object.keys(sections).map((name) => (
            <li key={name}>
              <a href={`?section=${name}`}>{name}</a>
            </li>
          ))}
        </ul>
      )}
    </SizeProvider>
  </DirectionProvider>,
)
