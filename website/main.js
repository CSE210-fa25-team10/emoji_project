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

function handleTranslate() {
    // TODO: for now, just translate the text directly
    const inputText = document.querySelector('textarea[name="emoji_input"]').value;
    const selectedMode = document.getElementById("translationSelector").value;
    const outputArea = document.querySelector('textarea[name="text_output"]');

    let outputText = "";

    if (selectedMode === "textInput") {
        // Text to Emoji, this is going to be changed soon
        outputText = inputText
            .replace(/happy/gi, "😊")
            .replace(/sad/gi, "😢");
    } else {
        // Emoji to Text, this is going to changed soon
        outputText = inputText
            .replace(/😊/g, "happy")
            .replace(/😢/g, "sad");
    }

    // Update the output box
    outputArea.value = outputText;
}
