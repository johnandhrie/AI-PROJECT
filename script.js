const GEMINI_API_KEY = "AQ.Ab8RN6KpppWoomqXDFn_q9Gr4p-3NhaXNTXtQU1ufOQuIedZaw";

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userText = inputField.value.trim();

    if (userText === "") return;

    // 1. Ipakita ang mensahe ng user
    appendMessage(userText, "user-message");
    inputField.value = "";

    // 2. Maglagay ng "nagtatype..." indicator
    const loadingMessage = appendMessage("Nag-iisip si ADHR AI...", "ai-message");

    try {
        // 3. Tumawag sa Google Gemini REST API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userText }]
                }]
            })
        });

        const data = await response.json();

        // Tanggalin ang loading indicator
        chatBox.removeChild(loadingMessage);

        if (data && data.candidates && data.candidates[0].content.parts[0].text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            appendMessage(aiResponse, "ai-message");
        } else {
            appendMessage("Pasensya na, may problema sa pagproseso ng tugon.", "ai-message");
        }
    } catch (error) {
        chatBox.removeChild(loadingMessage);
        appendMessage("Mali ang koneksyon o invalid ang API Key.", "ai-message");
    }
}

function appendMessage(text, className) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}