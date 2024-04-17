// Script para abrir o chat ao clicar em um amigo
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const closeChatBtn = document.querySelector('.close-chat-btn');
    const containerFriend = document.querySelector('.container_friend');
    const chat_header = document.getElementById('chat_header'); // Adiciona a referência ao elemento do cabeçalho do chat

    
    // Adiciona um event listener ao container de amigos
    containerFriend.addEventListener('click', (event) => {
        const target = event.target.closest('.frind_container');

        // Verifica se o elemento clicado é um amigo
        if (target) {
            // Obtém o ID e nome do amigo clicado
            const amigoId = target.dataset.friendId;
            // Armazena o ID e o nome do amigo clicado no localStorage
            const amigoName = target.dataset.nameAmigoId;
            
            // Abre o chat com o amigo
            openChatWithFriend(amigoId, amigoName);
        }
    });

    // Adiciona um event listener para o botão de fechar o chat
    closeChatBtn.addEventListener('click', () => {
        // Esconde o container do chat ao clicar no botão de fechar
        closeChatAndWebSocket();
    });

    // Adiciona um event listener ao cabeçalho do chat para fechar o chat
    chat_header.addEventListener('click', () => {
        // Esconde o container do chat ao clicar no cabeçalho
        closeChatAndWebSocket();
    });
    
});



const amigoId = localStorage.getItem('amigoId');
//const idAmigoClicado = localStorage.setItem('amigoId', amigoId);
console.log("console log vindo daqui " , amigoId)

// ATENCAO O BUG ESTA AQUI ******************************************
// Função para abrir o chat com um amigo
function openChatWithFriend(amigoId, amigoName) {
    

    // Verifica se o chat com o amigo já está aberto
    const chatContainer = document.getElementById('chatContainer');
    const chat_header = document.getElementById('chat_header');
    //const amigoNameTag = localStorage.getItem('amigoName');
    if (chatContainer.style.display !== 'block') {
        localStorage.setItem('amigoId', amigoId); // salva o id do amigo no localStorage
        //localStorage.setItem('amigoName', amigoName);

        // Você pode implementar aqui a lógica para abrir o chat com o amigo,
        // por exemplo, mudar o estilo do elemento chatContainer para exibi-lo.
        // Aqui está um exemplo básico:
        // Abre o chat com o amigo
        
        chatContainer.style.display = 'block';
       // const localStorage.getItem("idRecebido")
        // Inicia o chat com o amigo
        startChatWithFriend();
        chat_header.innerText = amigoName
       openChatWithFriend(amigoId);
        
    }
}
// ATENCAO O BUG ESTA AQUI ******************************************

// Função para iniciar o chat com um amigo
function startChatWithFriend() {
    // Verifica se o chat com o amigo já está aberto
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer.style.display !== 'block') {
        const userId = localStorage.getItem('idUsuario');
        // Fecha a conexão WebSocket atual, se existir
        if (websocket) {
            websocket.close();
        }
        // Conecta-se ao servidor WebSocket
        websocket = connectToWebSocket(userId);
    }
}



// Função para limpar o conteúdo do chat
function clearChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // Limpa todas as mensagens do chat
}


// Função para fechar o chat e encerrar a conexão WebSocket
function closeChatAndWebSocket() {
    const chatContainer = document.getElementById('chatContainer');
    const chatHeader = document.getElementById('chat_header'); // Adiciona a referência ao elemento do cabeçalho do chat

    // Oculta o container do chat
    chatContainer.style.display = 'none';

    // Limpa o conteúdo do chat
    clearChatMessages();

    // Fecha a conexão WebSocket, se existir
    if (websocket) {
        websocket.close();
    }
}
