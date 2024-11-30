const socket = io();
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameModal = new bootstrap.Modal(document.getElementById('username-modal'));
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');

let username = '';

const myId = Math.floor(Math.random() * 1000000) //create a random id

document.addEventListener('DOMContentLoaded', () => {
    usernameModal.show();
});

// Submit username
usernameSubmit.addEventListener('click', () => {
    const enteredUsername = usernameInput.value.trim();
    if (enteredUsername) {
        username = enteredUsername;
        usernameModal.hide();
        socket.emit('user connect', username);
    } else {
        alert('Username is required!');
    }
});

// Listen for Enter key to send message
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission (if any)
        sendMessage();
    }
});

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message function
function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText) {
        socket.emit('chat message', { username, text: messageText, id: myId});
        messageInput.value = ''; // Clear input
    }
}

// Listen for incoming messages
socket.on('chat message', (message) => {
    displayMessage(message, message.id == myId ? true : false); // Display messages
});
// Listen for disconnects
socket.on('user disconnect', (message) => {
    displayMessage(message, false, false, message); // Display messages
});
// Listen for connects
socket.on('user connect', (message) => {
    displayMessage(message, false, message); // Display messages
});

// Display message in chat
function displayMessage(message, isSelf, join = false, left = false) {
    if (join) {
        const messageDiv = document.createElement('div');
            messageDiv.innerHTML = `
            <p>${join} has joined the chat!</p>
        `;

        messages.appendChild(messageDiv);

        // Auto-scroll to the latest message
        messages.scrollTop = messages.scrollHeight;
        return
    }

    if (left) {
        const messageDiv = document.createElement('div');
            messageDiv.innerHTML = `
            <p>${left} has left the chat!</p>
        `;

        messages.appendChild(messageDiv);

        // Auto-scroll to the latest message
        messages.scrollTop = messages.scrollHeight;
        return
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isSelf ? 'self' : 'other');

    // Highlight messages from the current user
    if (message.username === username) {
        messageDiv.classList.add('self');
    } else {
        messageDiv.classList.add('other');
    }

    messageDiv.innerHTML = `
        <strong>${isSelf ? 'You' : message.username}:</strong>
        <p>${message.text}</p>
    `;

    messages.appendChild(messageDiv);

    // Auto-scroll to the latest message
    messages.scrollTop = messages.scrollHeight;
}

window.addEventListener('offline', function() {
    if (username != '') {
        socket.emit('user disconnect', username);
    }
});

window.addEventListener('beforeunload', function () {
    if (username != '') {
        socket.emit('user disconnect', username);
    }
});
