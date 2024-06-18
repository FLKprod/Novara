document.addEventListener('DOMContentLoaded', (event) => {
    const userInput = document.getElementById('userInput');
    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Charger les messages sauvegardés à l'initialisation
    loadMessages();
});

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
    document.getElementById('userInput').value = '';

    displayMessage('Utilisateur', userInput);

    const headers = {
        'Content-Type': 'application/json'
    };

    const body = {
        message: userInput
    };

    try {
        const response = await fetch('/sendMessage', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.response;
        displayMessage('VeriFile', botResponse);
    } catch (error) {
        console.error('Erreur:', error);
        displayMessage('VeriFile', 'Désolé, une erreur est survenue.');
    }
}

function displayMessage(type, message) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong style="color:#460F9B">${type}:</strong> ${message}`;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Sauvegarder le message dans le localStorage
    saveMessage(type, message);
}

function saveMessage(type, message) {
    const existingMessages = JSON.parse(localStorage.getItem('chatbotMessages')) || [];
    existingMessages.push({ type, message });
    localStorage.setItem('chatbotMessages', JSON.stringify(existingMessages));
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('chatbotMessages')) || [];
    messages.forEach(msg => {
        displayMessage(msg.type, msg.message);
    });
}
