const GEMINI_API_KEY = "AQ.Ab8RN6KmaXyeGPlyU6MZU-YMUgrpd_GQw-XU9A4K8YyQzgBjVQ";

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userText = inputField.value.trim();

    if (userText === "") return;

    // 1. Display user message
    appendMessage(userText, "user-message");
    inputField.value = "";

    // 2. Add loading indicator
    const loadingMessage = appendMessage("ADHR AI is thinking...", "ai-message");

    try {
        // 3. Request to Gemini REST API
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

        // Remove loading indicator
        chatBox.removeChild(loadingMessage);

        if (data && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            appendMessage(aiResponse, "ai-message");
        } else if (data.error) {
            console.error("Gemini API Error:", data.error);
            appendMessage(`API Error: ${data.error.message}`, "ai-message");
        } else {
            console.error("Unexpected response:", data);
            appendMessage("Received an unexpected response from the AI.", "ai-message");
        }
    } catch (error) {
        chatBox.removeChild(loadingMessage);
        console.error("Fetch Error:", error);
        appendMessage("Network error. Please try again.", "ai-message");
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
