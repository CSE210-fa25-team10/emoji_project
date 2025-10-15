#!/usr/bin/env node

/**
 * Simple CLI Test Runner - Vanilla JS, No Frameworks
 * Run with: node tests/run_tests.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

// Load emoji dictionary
let emojiDictionary = {};
try {
    const dictionaryPath = path.join(__dirname, '../emoji-dictionary.json');
    const dictionaryData = fs.readFileSync(dictionaryPath, 'utf8');
    emojiDictionary = JSON.parse(dictionaryData);
    console.log(`${colors.cyan}Loaded ${Object.keys(emojiDictionary).length} emojis from dictionary${colors.reset}\n`);
} catch (error) {
    console.error(`${colors.red}Error loading emoji-dictionary.json: ${error.message}${colors.reset}`);
    process.exit(1);
}

// Translation logic (same as main.js but without DOM)
function buildTranslationMaps(dictionary) {
    const emojiToTextMap = new Map();
    const textToEmojiMap = new Map();
    
    for (const [emoji, data] of Object.entries(dictionary)) {
        const definition = data.def.split(' - ')[0];
        emojiToTextMap.set(emoji, definition);
        
        if (data.context) {
            for (const [contextKey] of Object.entries(data.context)) {
                const key = contextKey.toLowerCase().replace(/_/g, ' ');
                if (!textToEmojiMap.has(key)) {
                    textToEmojiMap.set(key, emoji);
                }
            }
        }
        
        const defKey = definition.toLowerCase();
        if (!textToEmojiMap.has(defKey)) {
            textToEmojiMap.set(defKey, emoji);
        }
    }
    
    return { emojiToTextMap, textToEmojiMap };
}

function segmentText(text) {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const segments = [];
    let lastIndex = 0;
    let match;
    
    while ((match = emojiRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({
                type: 'text',
                content: text.substring(lastIndex, match.index)
            });
        }
        segments.push({
            type: 'emoji',
            content: match[0]
        });
        lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
        segments.push({
            type: 'text',
            content: text.substring(lastIndex)
        });
    }
    
    return segments;
}

function translateEmojiToText(inputText, emojiToTextMap) {
    const segments = segmentText(inputText);
    
    return segments.map(segment => {
        if (segment.type === 'emoji') {
            return emojiToTextMap.get(segment.content) || segment.content;
        }
        return segment.content;
    }).join('');
}

function translateTextToEmoji(inputText, textToEmojiMap) {
    let result = inputText;
    const sortedKeys = Array.from(textToEmojiMap.keys()).sort((a, b) => b.length - a.length);
    
    sortedKeys.forEach(key => {
        const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const emoji = textToEmojiMap.get(key);
        result = result.replace(regex, emoji);
    });
    
    return result;
}

// Build maps
const { emojiToTextMap, textToEmojiMap } = buildTranslationMaps(emojiDictionary);

// Test framework
let passedTests = 0;
let failedTests = 0;

function test(name, input, expected, translationFunc) {
    const result = translationFunc(input);
    if (result === expected) {
        console.log(`${colors.green}✓ PASS${colors.reset}: ${name}`);
        passedTests++;
    } else {
        console.log(`${colors.red}✗ FAIL${colors.reset}: ${name}`);
        console.log(`  Expected: "${expected}"`);
        console.log(`  Got:      "${result}"`);
        failedTests++;
    }
}

// Run tests
console.log(`${colors.bold}${colors.cyan}=== EMOJI TO TEXT TRANSLATION TESTS ===${colors.reset}\n`);

// Use actual emojis from the dictionary
const testEmojis = Object.keys(emojiDictionary).slice(0, 10); // Get first 10 emojis

test(
    "Single emoji translation",
    testEmojis[0],
    emojiToTextMap.get(testEmojis[0]),
    (input) => translateEmojiToText(input, emojiToTextMap)
);

test(
    "Multiple emojis in sequence",
    testEmojis[0] + testEmojis[1] + testEmojis[2],
    emojiToTextMap.get(testEmojis[0]) + emojiToTextMap.get(testEmojis[1]) + emojiToTextMap.get(testEmojis[2]),
    (input) => translateEmojiToText(input, emojiToTextMap)
);

test(
    "Emoji with surrounding text",
    `Hello ${testEmojis[0]} world`,
    `Hello ${emojiToTextMap.get(testEmojis[0])} world`,
    (input) => translateEmojiToText(input, emojiToTextMap)
);

test(
    "Empty input",
    "",
    "",
    (input) => translateEmojiToText(input, emojiToTextMap)
);

test(
    "Text only - no emojis",
    "Just plain text here",
    "Just plain text here",
    (input) => translateEmojiToText(input, emojiToTextMap)
);

test(
    "Mixed content with multiple emojis",
    `Start ${testEmojis[0]} middle ${testEmojis[1]} end`,
    `Start ${emojiToTextMap.get(testEmojis[0])} middle ${emojiToTextMap.get(testEmojis[1])} end`,
    (input) => translateEmojiToText(input, emojiToTextMap)
);

console.log(`\n${colors.bold}${colors.cyan}=== TEXT TO EMOJI TRANSLATION TESTS ===${colors.reset}\n`);

// Test with actual context keys from the dictionary
const contextKeys = Array.from(textToEmojiMap.keys()).slice(0, 10);

test(
    `Context key: "${contextKeys[0]}"`,
    contextKeys[0],
    textToEmojiMap.get(contextKeys[0]),
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

test(
    `Context key: "${contextKeys[1]}"`,
    contextKeys[1],
    textToEmojiMap.get(contextKeys[1]),
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

test(
    "Multiple context words in sentence",
    `${contextKeys[0]} and ${contextKeys[1]}`,
    `${textToEmojiMap.get(contextKeys[0])} and ${textToEmojiMap.get(contextKeys[1])}`,
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

test(
    "Case insensitive matching",
    contextKeys[0].toUpperCase(),
    textToEmojiMap.get(contextKeys[0]),
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

test(
    "Unknown words preservation",
    `${contextKeys[0]} unknown word`,
    `${textToEmojiMap.get(contextKeys[0])} unknown word`,
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

test(
    "Empty input",
    "",
    "",
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

test(
    "Text with punctuation",
    `Yeah! ${contextKeys[0]}!`,
    `Yeah! ${textToEmojiMap.get(contextKeys[0])}!`,
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

console.log(`\n${colors.bold}${colors.cyan}=== EDGE CASES ===${colors.reset}\n`);

test(
    "Whitespace preservation",
    `   ${contextKeys[0]}   `,
    `   ${textToEmojiMap.get(contextKeys[0])}   `,
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

test(
    "Newlines preservation",
    `${contextKeys[0]}\n${contextKeys[1]}\t${contextKeys[2]}`,
    `${textToEmojiMap.get(contextKeys[0])}\n${textToEmojiMap.get(contextKeys[1])}\t${textToEmojiMap.get(contextKeys[2])}`,
    (input) => translateTextToEmoji(input, textToEmojiMap)
);

// Test specific Gen Z slang if available
if (textToEmojiMap.has("lol")) {
    test(
        "Gen Z slang - lol",
        "lol",
        textToEmojiMap.get("lol"),
        (input) => translateTextToEmoji(input, textToEmojiMap)
    );
}

if (textToEmojiMap.has("fire")) {
    test(
        "Context word - fire",
        "fire",
        textToEmojiMap.get("fire"),
        (input) => translateTextToEmoji(input, textToEmojiMap)
    );
}

if (textToEmojiMap.has("sarcasm")) {
    test(
        "Context word - sarcasm",
        "sarcasm",
        textToEmojiMap.get("sarcasm"),
        (input) => translateTextToEmoji(input, textToEmojiMap)
    );
}

// Summary
console.log(`\n${colors.bold}${colors.cyan}=== TEST SUMMARY ===${colors.reset}`);
console.log(`Total Tests: ${passedTests + failedTests}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
console.log(`Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(2)}%`);

// Exit with appropriate code
if (failedTests > 0) {
    console.log(`\n${colors.red}${colors.bold}Some tests failed!${colors.reset}`);
    process.exit(1);
} else {
    console.log(`\n${colors.green}${colors.bold}All tests passed! 🎉${colors.reset}`);
    process.exit(0);
}
