## Emoji Translator -- give a name here

A simple, static web app that helps users translate between emojis and plain text. The UI is already scaffolded; the translation logic is currently a placeholder to be implemented.

## Quick start

You can run this as a static site.

- Easiest: open `website/index.html` directly in your browser (double‑click the file or drag it into a tab).
- Or, serve the folder locally (recommended for future development that may fetch JSON files):

```bash
# From the project root
python3 -m http.server 8000
# Then open http://localhost:8000/website/
```

## How users will use it

1. Open the app (see Quick start above).
2. Choose the input language from the dropdown:
	 - Emoji → translate emojis into text
	 - Text → translate text into emojis
3. Type your message into the left textarea.
4. Click “Translate” to see the result in the right textarea.

Note: As of now, the Translate button shows a placeholder alert. Implement the translation logic in `website/main.js` inside `handleTranslate()`.

## Project structure

```
emoji_project/
├── emoji.json                 # Emoji metadata dataset (tag as translation logic)
├── LICENSE                    # Project license
├── README.md                  # This document
├── tests/
│   ├── frontend_tests.js      # Placeholder for UI tests
│   └── output_test.js         # Placeholder for translation output tests
└── website/
		├── index.html             # App UI markup
		├── main.js                # App behavior (mode toggle + TODO: translate)
		└── style.css              # App styles
```

### Translation Logic

We found a public github online where the project has a file that stored all the emoji (from Apple) and their associated tags that we will use in this project for the main logic of translation.

Reference:
https://github.com/github/gemoji

## Testing

The `tests/` folder contains placeholders. Once translation is implemented, consider adding:

- Unit tests for text→emoji and emoji→text conversions.
- Edge cases: unknown words, mixed text+emoji input, skin tones/variations, punctuation handling, repeated emojis.

## Accessibility and UX notes

- The mode selector updates the output label for clarity.
- Consider adding keyboard shortcuts (e.g., Cmd+Enter to translate) and ARIA labels as you expand functionality.

## License

MIT
