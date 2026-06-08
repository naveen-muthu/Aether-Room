document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const usernameInput = document.getElementById('username-input');
    const messageInput = document.getElementById('message-input');
    const btnSend = document.getElementById('btn-send');

    // Utility: Append a new message to the chat history
    function appendMessage(username, text, isSystem = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        
        if (isSystem) {
            messageDiv.classList.add('system');
        }

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (isSystem) {
            messageDiv.innerHTML = `
                <div class="message-content">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-meta">
                    <span class="username">${escapeHTML(username)}</span> • <span class="time">${timeString}</span>
                </div>
                <div class="message-content">${escapeHTML(text)}</div>
            `;
        }

        chatHistory.appendChild(messageDiv);
        
        // Auto-scroll to the bottom of the chat
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Basic HTML escaping to prevent simple DOM injection from user input
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Core logic for sending a message
    function sendMessage() {
        let username = usernameInput.value.trim();
        const text = messageInput.value.trim();

        // Don't send empty messages
        if (text === '') return;

        // Default username if left blank
        if (username === '') {
            username = 'Anonymous';
        }

        // Add user message to UI
        appendMessage(username, text);
        
        // Clear input field and maintain focus for rapid typing
        messageInput.value = '';
        messageInput.focus();

        // Local Demo Functionality: Simulate a simple bot reply
        if(text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
            setTimeout(() => {
                appendMessage('AetherBot', 'Welcome to the lounge. Enjoy the calm.');
            }, 1000);
        } else if (text.toLowerCase().includes('rain')) {
             setTimeout(() => {
                appendMessage('AetherBot', 'The night rain scene is perfect right now.');
            }, 1500);
        }
    }

    // Event Listeners for sending
    btnSend.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    const botNames = ['Luna', 'Orion', 'Nova', 'Echo', 'Atlas'];
    const botMessages = [
        "This rain sound is so relaxing...",
        "Anyone else working late today?",
        "Just switched from the anime scene to the night city one.",
        "Love the vibe in here.",
        "Need to focus, good luck everyone.",
        "The lo-fi radio is exactly what I needed right now.",
        "Such a peaceful corner of the internet."
    ];

    function simulateOnlineUsers() {
        setInterval(() => {
            // 40% chance to send a message every 12 seconds
            if (Math.random() > 0.6) {
                const randomName = botNames[Math.floor(Math.random() * botNames.length)];
                const randomMsg = botMessages[Math.floor(Math.random() * botMessages.length)];
                appendMessage(randomName, randomMsg);
            }
        }, 12000);
    }

    // Initialize the chat with a welcome system message
    setTimeout(() => {
        appendMessage('', 'Welcome to the Aether Room Global Lounge. Please keep the vibe relaxing.', true);
        simulateOnlineUsers();
    }, 500);
});
