// Emojify - main logic
let emojiDictionary = {};
let emojiToTextMap = new Map();
let textToEmojiMap = new Map();

// Load emoji data on page load
async function loadEmojiData() {
    try {
        // Try multiple possible paths for emoji-dictionary.json
        let response;
        const paths = ['../emoji-dictionary.json', '/emoji-dictionary.json', './emoji-dictionary.json'];
        
        for (const path of paths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    console.log(`Successfully loaded emoji dictionary from: ${path}`);
                    break;
                }
            } catch (e) {
                console.warn(`Failed to fetch from ${path}:`, e.message);
            }
        }
        
        if (!response || !response.ok) {
            throw new Error('Could not find emoji-dictionary.json at any expected location');
        }
        
        emojiDictionary = await response.json();
        const emojiCount = Object.keys(emojiDictionary).length;
        console.log(`Loaded ${emojiCount} emojis from dictionary`);
        buildTranslationMaps();
        console.log(`Built translation maps: ${emojiToTextMap.size} emoji->text, ${textToEmojiMap.size} text->emoji`);
    } catch (error) {
        console.error('Error loading emoji data:', error);
        alert('Failed to load emoji dictionary. Please make sure you are running via HTTP server (not file://) and emoji-dictionary.json is accessible.');
    }
}

// Build lookup maps for fast translation
function buildTranslationMaps() {
    // Clear existing maps
    emojiToTextMap.clear();
    textToEmojiMap.clear();
    
    // Iterate through emoji dictionary
    for (const [emoji, data] of Object.entries(emojiDictionary)) {
        // Map emoji to its definition (extract just the core description before " - ")
        const definition = data.def.split(' - ')[0];
        emojiToTextMap.set(emoji, definition);
        
        // Map context keys to emoji for text-to-emoji translation
        if (data.context) {
            for (const [contextKey, contextValue] of Object.entries(data.context)) {
                const key = contextKey.toLowerCase().replace(/_/g, ' ');
                if (!textToEmojiMap.has(key)) {
                    textToEmojiMap.set(key, emoji);
                }
            }
        }
        
        // Also map the definition itself to the emoji
        const defKey = definition.toLowerCase();
        if (!textToEmojiMap.has(defKey)) {
            textToEmojiMap.set(defKey, emoji);
        }
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', loadEmojiData);

function updateTranslatorMode(selectedValue) {
    if (selectedValue == "textInput") {
        document.getElementById("outputHeader").textContent = "Translated Emoji";
        // swap like if the input language is emoji, happy in the input box should be
        // replaced with the emoji in the output box and vice versa
        // this is very similar to how google translate does it
        const inputArea = document.querySelector('textarea[name="emoji_input"]');
        const outputArea = document.querySelector('textarea[name="text_output"]');
        const temp = inputArea.value;
        inputArea.value = outputArea.value;
        outputArea.value = temp;
    } else {
        document.getElementById("outputHeader").textContent = "Translated Text";
        const inputArea = document.querySelector('textarea[name="emoji_input"]');
        const outputArea = document.querySelector('textarea[name="text_output"]');
        const temp = inputArea.value;
        inputArea.value = outputArea.value;
        outputArea.value = temp;
    }
}

// Helper function to split text into emoji and non-emoji segments
function segmentText(text) {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const segments = [];
    let lastIndex = 0;
    let match;
    
    while ((match = emojiRegex.exec(text)) !== null) {
        // Add text before emoji
        if (match.index > lastIndex) {
            segments.push({
                type: 'text',
                content: text.substring(lastIndex, match.index)
            });
        }
        // Add emoji
        segments.push({
            type: 'emoji',
            content: match[0]
        });
        lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
        segments.push({
            type: 'text',
            content: text.substring(lastIndex)
        });
    }
    
    return segments;
}

// Translate emoji to text
function translateEmojiToText(inputText) {
    const segments = segmentText(inputText);
    
    return segments.map(segment => {
        if (segment.type === 'emoji') {
            // Look up emoji in map, fallback to original emoji if not found
            return emojiToTextMap.get(segment.content) || segment.content;
        }
        return segment.content;
    }).join('');
}

// Translate text to emoji
function translateTextToEmoji(inputText) {
    let result = inputText;
    
    // Sort keys by length (descending) to match longer phrases first
    const sortedKeys = Array.from(textToEmojiMap.keys()).sort((a, b) => b.length - a.length);
    
    // Replace each word/phrase with its corresponding emoji
    sortedKeys.forEach(key => {
        // Create regex to match whole words (case insensitive)
        const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const emoji = textToEmojiMap.get(key);
        result = result.replace(regex, emoji);
    });
    
    return result;
}

function handleTranslate() {
    const inputText = document.querySelector('textarea[name="emoji_input"]').value;
    const selectedMode = document.getElementById("translationSelector").value;
    const outputArea = document.querySelector('textarea[name="text_output"]');

    if (!inputText.trim()) {
        outputArea.value = "";
        return;
    }

    // Check if emoji data is loaded
    if (Object.keys(emojiDictionary).length === 0) {
        outputArea.value = "⚠️ Loading emoji dictionary... Please wait and try again.";
        return;
    }

    let outputText = "";

    if (selectedMode === "textInput") {
        // Text to Emoji
        outputText = translateTextToEmoji(inputText);
    } else {
        // Emoji to Text
        outputText = translateEmojiToText(inputText);
    }

    // Update the output box
    outputArea.value = outputText;
}
