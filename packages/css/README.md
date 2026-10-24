<a href="https://surflane.page"><img src="https://surflane.page/brand/lockup-light.png" alt="Surflane" width="228" /></a>

# @surflane/css

Surflane's CSS-only layer: classes for controls, layout composition, document typography and presentation markup that work without React. They read the tokens from [`@surflane/design-tokens`](https://www.npmjs.com/package/@surflane/design-tokens), and `@surflane/ui` builds its components on them. Browse the system in the [catalog](https://surflane.page).

```sh
npm install @surflane/css @surflane/design-tokens
```

```css
@import '@surflane/design-tokens/tokens.css';
@import '@surflane/css/foundations.css';
@import '@surflane/css/presentation.css';
```

## Entry points

| Export               | Contents                                                     |
| -------------------- | ------------------------------------------------------------ |
| `controls.css`       | Framework-neutral control classes such as icon buttons       |
| `foundations.css`    | Layout composition classes such as container, stack and grid |
| `foundations/*.css`  | One composition at a time                                    |
| `presentation.css`   | Classes for native markup such as avatars, badges and tables |
| `presentation/*.css` | One presentation at a time                                   |
| `typography.css`     | Opt-in document typography through the typography class      |

Every stylesheet declares the Surflane cascade layers first, so the order you import them in doesn't change the result. Load the tokens before these classes. The packages are released together with one version; install matching versions.

## License

MIT OR Apache-2.0
