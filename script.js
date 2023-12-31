$(document).ready(function() {
    const userIdField = document.getElementById('user_id');
    const messagesDiv = document.querySelector('.messages');
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.getElementById('send');
    const typingIndicator = document.querySelector('.typing-indicator');

    sendButton.addEventListener('click', function() {
        sendMessage();
    });

    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const session_id = userIdField.value;
        const userInput = messageInput.value;
        const modelSelection = document.getElementById('model_selection').value;
        
        if (userInput.trim()) {
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.innerText = userInput;
            messagesDiv.appendChild(userMessage);
            messageInput.value = '';

            if (session_id.trim() === '') {
                alert('Error: User ID is required');
                return;
            }

            messageInput.disabled = true;
            sendButton.disabled = true;

            typingIndicator.style.display = 'flex';

            $.ajax({
                url: 'https://dml2220chatbot-6301f895d848.herokuapp.com/api/chat',
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    session_id: session_id,
                    input: userInput,
                    model: modelSelection
                }),
                success: function(data) {
                    let botResponse = data.bot_response;
                    botResponse = botResponse.replace(/\n/g, ' <br> ');
                    const botResponseWords = botResponse.split(' ');

                    setTimeout(() => {
                        const gptMessage = document.createElement('div');
                        gptMessage.className = 'message gpt-message';
                        messagesDiv.appendChild(gptMessage);                   
                        messagesDiv.scrollTop = messagesDiv.scrollHeight;
                        typingIndicator.style.display = 'none';

                        typewriterEffect(gptMessage, botResponseWords, 0);
                    }, 100);
                },
                error: function(err) {
                    console.error("Error:", err);
                }
            });
        }
    }

    function typewriterEffect(element, words, index) {
        if (index < words.length) {
            element.innerHTML += (index > 0 ? ' ' : '') + words[index];
            const delay = calculateDelay(words[index]);

            setTimeout(() => {
                typewriterEffect(element, words, index + 1);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, delay);
        }

        if (index === words.length - 1) {
            messageInput.disabled = false;
            updateSendButtonState();
        }
    }

    function calculateDelay(word) {
        const baseDelay = 50;
        const additionalDelayPerChar = 5;
        const delayVariability = 20;
        const wordDelay = baseDelay + word.length * additionalDelayPerChar;
        const randomDelay = Math.random() * delayVariability;

        return wordDelay + randomDelay;
    }

    function updateSendButtonState() {
        const userId = $('#user_id').val();
        const userInput = $('#user_input').val();

        if (userId && userInput) {
            $(sendButton).removeClass('disabled').addClass('enabled');
            sendButton.disabled = false;
        } else {
            $(sendButton).removeClass('enabled').addClass('disabled');
            sendButton.disabled = true;
        }
    }

    // Initial setup
    updateSendButtonState();

    $('#user_id, #user_input').on('input', updateSendButtonState);
});
// Logic for the consent pop-up
document.getElementById('consentButton').addEventListener('click', function() {
    document.getElementById('consentPopup').style.display = 'none';
});