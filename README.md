# Emojify

A simple, interactive web app called **Emojify** that translates between emojis and text bidirectionally, using contextual Gen Z emoji usage patterns.

**Key Features:**

- **Emoji → Text**: Convert emojis into their contextual meanings (e.g., 😀 → "grinning face")

- **Text → Emoji**: Convert words/phrases into relevant emojis (e.g., "happy" → 😁, "lol" → 😂)## What It Does## Quick start

- **Context-aware**: Uses Gen Z slang and modern emoji usage patterns ("fire" → 🔥, "sarcasm" → 🙃)

- **Switch modes seamlessly**: Content automatically swaps when you change translation direction


## 🚀 Running the Application

### 1. Start the Server
clone the project and cd to the project's directory
```bash
python3 -m http.server 8000
```

### 2. Open in Browser **need to host in somewhere else here**
```
http://localhost:8000/website/
```

### 3. Verify It's Working
Start to type in some phrases and emojis.
### Gen Z Slang → Emojis
```
Input: lol dead cringe slay
Output: 😂 💀 😬 💅
```

### Context Words → Emojis
```
Input: awkward oops passive aggressive sarcasm
Output: 😅 😁 🙂 🙃
```

### Mixed Content
```
Input: I'm happy but also sad and awkward lol
Output: I'm 😁 but also 😔 and 😅 😂
```
Note: Outputs depend on the current mappings in `emoji-dictionary.json`. If you change the dictionary, results will update accordingly.


## Emojify Project Structure

```
emoji_project/
├── README.md                # documentation
├── emoji-dictionary.json    # dataset
├── emoji.json               # reference dataset (didn't use)
├── package.json             # npm config for CLI test script
├── LICENSE                  
├── website/                 # frontend
│   ├── index.html           # UI
│   ├── main.js              # translation logic (emoji ↔ text)
│   └── style.css            # styling
├── tests/                   
│   ├── run_tests.js         # CLI test runner (Node.js, no frameworks)
└── └──CLI_TESTING.md        # CLI testing guide
```

**Key files:**
- `website/main.js`: All translation logic for the web app
- `emoji-dictionary.json`: The Gen Z emoji mapping logic used for all translations
- `tests/run_tests.js`: Standalone command-line test runner (no browser required)