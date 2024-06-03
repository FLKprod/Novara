function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
        chatbotContainer.style.display = 'flex';
    } else {
        chatbotContainer.style.display = 'none';
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === '') return;

    displayMessage('Utilisateur', userInput);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const body = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }, {role: "system", content: "Vous êtes un assistant spécialisé en cybersécurité. Répondez uniquement aux questions concernant la cybersécurité , les attaques informatique , les toute autres question qui en rapport avec la securite informatique. Si la question ne concerne pas la ennoces, répondez par 'Je suis désolé, mais je ne suis pas programmé pour cette opération.'"}]
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.choices[0].message.content;
        displayMessage('VeriFile', botResponse);
    } catch (error) {
        console.error('Erreur:', error);
        displayMessage('VeriFile', 'Désolé, une erreur est survenue.');
    }

    document.getElementById('userInput').value = '';
}

function displayMessage(type, message) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong style="color:#460F9B">${type}:</strong> ${message}`;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}