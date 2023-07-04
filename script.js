$(document).ready(function() {
    const userIdField = document.getElementById('user_id');
    const messagesDiv = document.querySelector('.messages');
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.getElementById('send');
    const typingIndicator = document.querySelector('.typing-indicator');

    userIdField.addEventListener('blur', function() {
        $.ajax({
            url: 'https://dml2220chatbot-6301f895d848.herokuapp.com/api/start',
            type: 'get',
            data: {
                id: userIdField.value
            }
        });
    });

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
        if (session_id.trim() === '') {
            alert('Error: User ID is required');
            return;
        }
        if (userInput.trim()) {
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.innerText = userInput;
            messagesDiv.appendChild(userMessage);
            messageInput.value = '';
    
            typingIndicator.style.display = 'flex';
            $.ajax({
                url: 'https://dml2220chatbot-6301f895d848.herokuapp.com/api/chat',
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    session_id: session_id,
                    input: userInput
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
                        typingIndicator.style.display = 'none'; // Hide the typing indicator here
    
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
            }, delay);
        }
    }

    function calculateDelay(word) {
        const baseDelay = 100;
        const additionalDelayPerChar = 5;
        const delayVariability = 20;
        const wordDelay = baseDelay + word.length * additionalDelayPerChar;
        const randomDelay = Math.random() * delayVariability;
        return wordDelay + randomDelay;
    }
});
function updateSendButtonState() {
    var userId = $('#user_id').val();
    var userInput = $('.message-input').val();

    if(userId && userInput) {
        $('.send-button').removeClass('disabled').addClass('enabled');
    } else {
        $('.send-button').removeClass('enabled').addClass('disabled');
    }
}

$(document).ready(function() {
    updateSendButtonState(); // Disable button at page load

    $('#user_id, .message-input').on('input', updateSendButtonState);
});