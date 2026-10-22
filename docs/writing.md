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

## Foundation pages

A foundation page owns one system-wide topic, such as color or motion. Readers open it to decide something, so it gives the rules first and the detail after. Each page should take about 2 minutes to read.

### Page shape

Every foundation page has the same parts in the same order.

| Part       | What it holds                                           | Shape                                                                                          |
| ---------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Name       | The topic                                               | A noun of 1–3 words: "Color", "Interaction states"                                             |
| Summary    | What the page decides, under the title and on the index | One sentence, 12 words or fewer, starting with a verb                                          |
| Principles | The page's decisions                                    | 3–5 items, each a bold imperative and one sentence of reason                                   |
| Sections   | One topic each: the model, how to apply it, the tokens  | A noun-phrase heading, a first sentence that states the point, then a figure, preview or table |
| Lab        | An optional tool for trying values                      | Last, after the rules it applies                                                               |
| Related    | The pages that own the neighboring rules                | Links only                                                                                     |

- **On this page** lists every section, spelled exactly as its heading.
- **Section headings** name the subject: "Elevation", "Contrast pairs". Put imperatives in Principles, and don't use slogans such as "Motion has a purpose".
- **Tables** hold values and short fragments, never sentences. Explain a row in the prose above it, or not at all.
- **Previews** show a rule at work. Lead into one with a sentence that says what to look at.

### Length

- Keep a page's prose to about 450 English words or 1,000 Korean characters, and never past 650 words or 1,500 characters. Tables, code, previews and labs don't count.
- Give each paragraph one idea in 2–5 sentences.
- Split a sentence over 25 words. In Korean, split one that runs past a line, about 50 characters.

### One home per rule

Each rule and number lives on one page, and other pages link to it. Name a token instead of restating its value.

| Topic                                               | Home               |
| --------------------------------------------------- | ------------------ |
| Spacing, grid, component sizes                      | Layout             |
| Planes, elevation, borders, emphasis                | Visual hierarchy   |
| Stacking order, portals, overlays                   | Layers             |
| Color roles, contrast ratios                        | Color              |
| Type roles, reading measure, line height            | Typography         |
| Icon sizes, stroke, icon names                      | Iconography        |
| Hover, pressed, selected, disabled, focus ring      | Interaction states |
| Durations, easing, reduced motion, theme transition | Motion             |
| Target size, keyboard model, announcements          | Accessibility      |
| Wording, errors, numbers and dates                  | Content            |
| Theme selection and scoped themes                   | Themes             |

## Labels and headings

- **Headings:** sentence case, nouns or noun phrases ("Keyboard and accessibility"), never a question.
- **Buttons:** a verb plus a noun ("Copy install command", "Clear filters"). Use "Save", "Cancel" and "Close" on their own.
- **Accessible names:** say what the control does, not what it looks like. Tests often find controls by their names, so update the tests whenever a name changes.

## Mechanics

- American English: "behavior", "color".
- Use the serial comma, as the Google and Microsoft style guides do: "Tokens, components, and patterns".
- Contractions are fine and read naturally: "don't", "isn't".
- Write measurements and counts as numerals: "3 rows", "12px".

## Korean

Korean copy follows the principles above. These rules cover what the English rules don't.

- **Endings.** Describe with "-합니다" and instruct with "-하세요": "숫자 추세를 비교합니다." Don't mix in "-해요" or "-십시오".
- **One message per sentence.** Put the point first, then the condition or reason.
- **Plain Korean, not translationese.**

  | Avoid                                | Write                      |
  | ------------------------------------ | -------------------------- |
  | 사용자에 대한 안내                   | 사용자 안내, 사용자의 안내 |
  | 개선을 통해                          | 개선으로                   |
  | 있을 경우                            | 있으면                     |
  | 변경되어집니다, 사용하게 됩니다      | 바뀝니다, 사용합니다       |
  | 위치하고 있습니다                    | 있습니다                   |
  | 설명을 제공합니다, 제거를 수행합니다 | 설명합니다, 제거합니다     |
  | 권한을 가지고 있지 않으면            | 권한이 없으면              |
  | 기능들                               | 기능                       |

- **Names stay as the API spells them.** Write component, prop, part and token names in code: `Button`, `--color-accent`. Write the general idea in Korean: 버튼.
- **Familiar Korean words.** Add the English term in parentheses only at its first mention, and only when readers know it better: 대비(contrast). Follow 외래어 표기법: 마케팅, not 마켓팅.
- **Spacing.** A unit may attach to a numeral: 3단계, 10개. Write CSS values exactly as in code: `16px`. Space dependent nouns: 지원 시, 기재 여부.
- **One term per concept.** Reuse the term the catalog already uses.
- **Pair every "don't" with its alternative:** "누락 값을 0으로 대체하지 마세요. 대신 null을 전달하세요."

## What to keep

Tighten the wording, never the facts. Keep every technical claim, accessibility rule, prop name, token name and number. If a sentence holds a rule, the shorter version must still state that rule.
