function updateTranslatorMode(selectedValue) {
    if (selectedValue == "textInput") {
        document.getElementById("outputHeader").textContent = "Translated Emoji";
    } else {
        document.getElementById("outputHeader").textContent = "Translated Text";
    }
}

function handleTranslate() {
    alert("FIXME: Translate input");
}