// Script para se comunicar com a API e gerenciar o chat
let websocket; // Variável global para armazenar a conexão WebSocket
// Obtém o ID do usuário logado
const userId = localStorage.getItem('idUsuario');

// URL do servidor WebSocket, ajuste conforme necessário
const websocketUrl = `wss://api-mini.onrender.com/${userId}`;




// Função para se conectar ao servidor WebSocket
function connectToWebSocket() {
    const ws = new WebSocket(websocketUrl);

    // Ao abrir a conexão
    ws.onopen = () => {
        // mudar status de online 
        console.log('Conexão estabelecida com o servidor WebSocket');
    };



    ws.onmessage = (event) => {
        const chat_header = document.getElementById('chat_header');
        const data = JSON.parse(event.data);
        console.log("console log event data", event.data)
        console.log('Dados recebidos:', data.receiver); // Para fins de depuração
        const idRecebido = data.receiver;
        localStorage.setItem("idRecebido", idRecebido);
        // Busca o nome do remetente no array de amigos



        // Verifica se a mensagem é uma notificação de nova mensagem
        if (data.notification && data.notification === true) {

            // Verifica se o chat com o remetente já está aberto
            const chatOpen = isChatOpenWithFriend(data.sender); // Esta função deve retornar true se o chat estiver aberto com o remetente

            if (!chatOpen) {

                // Abre o chat com o amigo automaticamente
                openChatWithFriend(data.sender);

                localStorage.setItem("amigo_id", idRecebido); // Salva o ID do amigo no localStorage



                chat_header.innerHTML = data.senderName;
                
            }
        }

        // Exibe a mensagem recebida
        displayMessage(data.sender, data.senderName, data.message);
    };





    /*
   // Ao receber uma mensagem
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Dados recebidos:', data); // Para fins de depuração
    // Verifica se a mensagem é uma notificação de nova mensagem
    if (data.notification && data.notification === true) {
        // Verifica se o chat com o remetente já está aberto
        const chatOpen = isChatOpenWithFriend(data.sender); // Esta função deve retornar true se o chat estiver aberto com o remetente
        if (!chatOpen) {
            // Abre o chat com o amigo automaticamente
            openChatWithFriend(data.sender);
        }
    }
    // Exibe a mensagem recebida
    displayMessage(data.sender, data.message);
};
*/



    // Ao fechar a conexão
    ws.onclose = () => {
        console.log('Conexão com o servidor WebSocket fechada');
    };

    // Função para tratar erros
    ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
    };

    return ws;
}

// Função para verificar se o chat com um amigo está aberto
function isChatOpenWithFriend(amigoId) {
    // Verifica se o chat com o amigo está aberto
    const chatContainer = document.getElementById('chatContainer');
    const chatAmigoId = localStorage.getItem('amigoId');
    return chatContainer.style.display === 'block' && chatAmigoId === amigoId;
}


// Função para iniciar o chat com um amigo
function startChatWithFriend() {
    // Verifica se o chat com o amigo já está aberto
    const chatOpen = isChatOpenWithFriend(localStorage.getItem('amigoId'));
    if (!chatOpen) {
        // Fecha a conexão WebSocket atual, se existir
        if (websocket) {
            websocket.close();
        }
        // Conecta-se ao servidor WebSocket apenas se o chat não estiver aberto
        websocket = connectToWebSocket();
    }
}

function displayMessage(sender, senderName, message) {
    const chatMessages = document.getElementById('chatMessages');
    // Adiciona a mensagem com a classe apropriada
    if (sender !== undefined && message !== undefined) {
        // Verifica se a mensagem é do usuário logado
        const isCurrentUserMessage = sender === localStorage.getItem('nomeUsuario');
        // Adiciona a classe correspondente com base no remetente da mensagem
        const messageClass = isCurrentUserMessage ? 'sent-message' : 'received-message';
        // Constrói o HTML da mensagem com o nome do remetente e a mensagem
        const messageHTML = `<div class="${messageClass}"><strong>${senderName}:</strong> ${message}</div>`;
        // Adiciona a mensagem ao chat
        chatMessages.innerHTML += messageHTML;
    }
}



// Função para enviar uma mensagem para um amigo
function sendMessageToFriend(amigoId, message) {
    const nomeUsuario = localStorage.getItem('nomeUsuario');


    // Cria um objeto com os dados da mensagem
    const data = {
        sender: `${nomeUsuario}`, // ID do usuário logado
        receiver: amigoId, // ID do amigo
        message: message,
        notification: true // Indica que é uma notificação de nova mensagem
    };

    // Envia a mensagem para o servidor WebSocket
    websocket.send(JSON.stringify(data));
}

// Função para lidar com o envio de mensagens quando o botão de enviar é clicado
function handleSendMessage() {
    const messageInput = document.getElementById('messageInput');
    const amigoId = localStorage.getItem('amigoId'); // Obtém o ID do amigo
    const amigoName = localStorage.getItem('amigoName');
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    const message = messageInput.value.trim();
    if (message) {
        // Envia a mensagem para o amigo
        sendMessageToFriend(amigoId, message);

        // Exibe a mensagem enviada no chat
        displayMessage(localStorage.getItem('nomeUsuario'), localStorage.getItem('nomeUsuario'), message);
        //displayMessage(`${nomeUsuario}`, message);

        // Limpa o campo de entrada
        messageInput.value = '';
    }
}

// Adiciona um event listener ao botão de enviar mensagem
const sendMessageButton = document.getElementById('sendMessageButton');
sendMessageButton.addEventListener('click', handleSendMessage);


// Ao carregar a página, inicia o chat com o amigo
startChatWithFriend();

// Ao carregar a página, conecta-se ao servidor WebSocket
//const websocket = connectToWebSocket();
