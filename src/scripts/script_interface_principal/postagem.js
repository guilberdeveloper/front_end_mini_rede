document.addEventListener('DOMContentLoaded', function () {
    const postForm = document.getElementById('post-form');

    postForm.addEventListener('submit', function (event) {
        
        const postContent = document.getElementById('post-content').value;

        // Verifica se o conteúdo da postagem não está vazio
        if (!postContent.trim()) {
            console.error('O conteúdo da postagem não pode estar vazio.');
            return;
        }
        
        // Envia a postagem para o backend
        enviarPostagem(postContent);
    });
});

function enviarPostagem(postContent) {
    const idUsuario = localStorage.getItem('idUsuario');
    const token = localStorage.getItem('token');

    if (!idUsuario || !token) {
        console.error('ID do usuário ou token não encontrados.');
        return;
    }

    fetch('https://api-mini.onrender.com/api/publicacoes', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: idUsuario, texto: postContent })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao fazer a postagem');
        }
        return response.json();
    })
    .then(data => {
        console.log('Postagem realizada com sucesso:', data);
        // Limpa o campo de entrada após o envio bem-sucedido
        document.getElementById('post-content').value = '';
        // Exibe a nova postagem imediatamente após o envio bem-sucedido
        exibirPostagem(data);
    })
    .catch(error => {
        console.error('Erro ao fazer a postagem:', error);
        // Adicione código aqui para lidar com erros de postagem
    });
}

function exibirPostagem(postagem) {
    const postagensContainer = document.getElementById('feed-container');

    const postagemDiv = document.createElement('div');
    postagemDiv.classList.add('postagem');
    postagemDiv.dataset.postId = postagem.id;

    const postContent = document.createElement('p');
    postContent.textContent = postagem.texto;
    postagemDiv.appendChild(postContent);

    postagensContainer.prepend(postagemDiv); // Adiciona a nova postagem no início do contêiner
}
