# Theme and motion

Framework-neutral theme transitions live in the tokens package. Consumers own preference persistence and system subscriptions. Commit the resolved theme synchronously inside transitionTheme; save preferences outside the animation callback.

Respect prefers-reduced-motion. Color feedback uses semantic OKLCH roles; hover, focus, selected, disabled and readonly are separate states. Keep focus rings stable while hovered. Theme selection should not reset forms or close overlays unexpectedly.

The catalog and automated tests exercise theme changes, asynchronous state and reduced motion. See the motion foundation page for interactive examples.
