## How to Run

### Run Tests (Two Ways)

**1. Direct with Node.js:**
```bash
node tests/run_tests.js
```

**2. Using npm:**
```bash
npm test
```

## What It Tests

✅ **18 automated tests** covering:
- Emoji → Text translation
- Text → Emoji translation  
- Edge cases (whitespace, newlines, punctuation, case sensitivity)
- Gen Z slang mappings ("lol", "fire", "sarcasm")
- Unknown content preservation

## Current Test Results

```
Loaded 414 emojis from dictionary

=== EMOJI TO TEXT TRANSLATION TESTS ===

✓ PASS: Single emoji translation
✓ PASS: Multiple emojis in sequence
✓ PASS: Emoji with surrounding text
✓ PASS: Empty input
✓ PASS: Text only - no emojis
✓ PASS: Mixed content with multiple emojis

=== TEXT TO EMOJI TRANSLATION TESTS ===

✓ PASS: Context key: "greeting"
✓ PASS: Context key: "okay"
✓ PASS: Multiple context words in sentence
✓ PASS: Case insensitive matching
✓ PASS: Unknown words preservation
✓ PASS: Empty input
✓ PASS: Text with punctuation

=== EDGE CASES ===

✓ PASS: Whitespace preservation
✓ PASS: Newlines preservation
✓ PASS: Gen Z slang - lol
✓ PASS: Context word - fire
✓ PASS: Context word - sarcasm

=== TEST SUMMARY ===
Total Tests: 18
Passed: 18
Failed: 0
Success Rate: 100.00%

All tests passed! 🎉
```

## Files in Tests

1. **tests/run_tests.js** - Main test runner (vanilla JS)
2. **package.json** - npm configuration with test script

## How It Works

1. Loads `emoji-dictionary.json`
2. Builds translation maps (same logic as `main.js`)
3. Runs translation functions with various test inputs
4. Compares results to expected outputs
5. Reports pass/fail with colored output
6. Exits with appropriate code

## Adding More Tests

```javascript
test(
    "Test description",
    "input text",
    "expected output",
    (input) => translateTextToEmoji(input, textToEmojiMap)
);
```
