# Writing for Surflane

How the catalog, component docs and examples are worded. People scan documentation before they read it, so every sentence should be easy to scan: short, front-loaded and specific.

## Principles

1. **Lead with the point.** Start each field, paragraph and sentence with what the reader needs: what the component is, when to use it, what to do. Put context and exceptions after it.
2. **One idea per sentence.** Aim for 20 words or fewer. Split a sentence at a semicolon, or wherever it joins two rules with "and".
3. **Address the reader.** Write in the present tense and the active voice. Give instructions in the imperative: "Use", "Keep", "Don't". Avoid "you can", "it is recommended", "make sure to" and "note that".
4. **Every word earns its place.** Drop filler such as "simply", "actually", "in order to" and "basically". Prefer a verb to a noun phrase: write "decide", not "make a decision". Don't restate the heading in the first sentence.
5. **Be specific.** Name the prop, token, part or key instead of describing it. Use numbers where they decide something: 44px, 4.5:1, 300ms. Don't use marketing adjectives such as "powerful", "seamless" or "beautiful".
6. **One term per concept.** Use the same name for the same thing everywhere. Write part names as the API spells them: Root, Trigger, Viewport. Don't alternate between synonyms such as popup, popover and overlay for one part.
7. **Pair every "don't" with an alternative.** "Don't use Toast for validation errors. Show a field error instead." A reader who is told only what not to do is left without a next step.

## Component page fields

| Field      | What it answers                                                   | Shape                                                                          |
| ---------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Summary    | What it is, in the catalog index                                  | One sentence, 12 words or fewer, starting with a verb: "Groups related tools…" |
| `usage`    | When to use it, then the one or two composition rules that matter | 2–4 sentences                                                                  |
| `avoid`    | When not to use it, each case with its alternative                | 1–3 sentences                                                                  |
| `keyboard` | Keys and focus behavior, then the screen reader contract          | Short sentences; name each key                                                 |
| `anatomy`  | Part structure                                                    | The `Root → Part` notation, no prose                                           |

## Labels and headings

- **Headings:** sentence case, nouns or noun phrases ("Keyboard and accessibility"), never a question.
- **Buttons:** a verb plus a noun ("Copy install command", "Clear filters"). Use "Save", "Cancel" and "Close" on their own.
- **Accessible names:** say what the control does, not what it looks like. Tests often find controls by their names, so update the tests whenever a name changes.

## Mechanics

- American English: "behavior", "color".
- Use the serial comma, as the Google and Microsoft style guides do: "Tokens, components, and patterns".
- Contractions are fine and read naturally: "don't", "isn't".
- Write measurements and counts as numerals: "3 rows", "12px".

## What to keep

Tighten the wording, never the facts. Keep every technical claim, accessibility rule, prop name, token name and number. If a sentence holds a rule, the shorter version must still state that rule.
