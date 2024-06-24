document.addEventListener('DOMContentLoaded', (event) => {
    const userInput = document.getElementById('userInput');
    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Charger les messages sauvegardés à l'initialisation
    //loadMessages();
});

function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
        chatbotContainer.style.display = 'flex';
    } else {
        chatbotContainer.style.display = 'none';
    }
}

var socket = io();
var currentParagraph = null;

socket.on('connect', function() {
    console.log('Connected to the server.');
});

socket.on('message_from_server', function(data) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    if (!currentParagraph && data.text != '') {
        currentParagraph = document.createElement("p");
        currentParagraph.innerHTML = `<strong style="color:#460F9B">VeriFile: </strong>`;
        document.getElementById('chatbotMessages').appendChild(currentParagraph);
    }

    if (!data.more) {
        currentParagraph = null; // Reset for next message
    } else{
        currentParagraph.innerHTML += data.text;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === '') return;
    document.getElementById('userInput').value = '';

    displayMessage('Utilisateur', userInput);

    socket.emit('message_from_client', { message: userInput });
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
