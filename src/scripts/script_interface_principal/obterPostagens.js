document.addEventListener('DOMContentLoaded', function () {
    // Inicialmente carrega as postagens
    carregarPostagens();

    // Define um intervalo para carregar as postagens a cada minuto (60000 milissegundos)
    setInterval(carregarPostagens, 40000);

    // Event listener para os botões de like e dislike
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('like-btn')) {
            const postId = event.target.closest('.post').dataset.postId;
            darLike(postId);
        }

        if (event.target.classList.contains('dislike-btn')) {
            const postId = event.target.closest('.post').dataset.postId;
            darDeslike(postId);
        }

        if (event.target.classList.contains('comentar-btn')) {
            const postId = event.target.closest('.post').dataset.postId;
            const comentarioInput = event.target.closest('.post').querySelector('.comentario-input');
            const comentario = comentarioInput.value.trim();
            if (comentario !== '') {
                comentar(postId, comentario);
                comentarioInput.value = ''; // Limpa o campo de comentário após enviar
            }
        }

        if (event.target.classList.contains('ver-comentarios-btn')) {
            const comentariosContainer = event.target.closest('.post').querySelector('.comentarios-container');
            comentariosContainer.classList.toggle('hidden');
        }
    });
});


// Array para armazenar os IDs das postagens já exibidas
let postagensExibidas = [];

function carregarPostagens() {
    fetch('https://api-mini.onrender.com/api/publicacoes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar postagens');
            }
            return response.json();
        })
        .then(data => {
            console.log('Postagens carregadas:', data);
            // Filtra as postagens para exibir apenas aquelas que ainda não foram exibidas
            const novasPostagens = data.filter(postagem => !postagensExibidas.includes(postagem._id));
            // Inverte a ordem das postagens antes de exibi-las
            exibirPostagens(novasPostagens.reverse());
        })
        .catch(error => {
            console.error('Erro ao carregar postagens:', error);
            // Adicione código aqui para lidar com erros de carregamento de postagens
        });
}

function exibirPostagens(postagens) {
    const feedContainer = document.getElementById('feed-container');

    // Iterar sobre cada postagem e criar elementos HTML para exibi-las
    postagens.forEach(postagem => {
        const postId = postagem._id; // Atribuir o ID da postagem à variável postId

        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.dataset.postId = postId;

        // Armazena o ID da postagem como exibido
        postagensExibidas.push(postId);

        const postHeaderDiv = document.createElement('div');
        postHeaderDiv.classList.add('post-header');

        // Adicionando a foto do usuário
        const img = document.createElement('img');
        img.src = `https://api-mini.onrender.com/api/foto/${postagem.usuario_id._id}`;
        img.alt = 'Imagem do usuário';
        postHeaderDiv.appendChild(img);

        const h2 = document.createElement('h2');
        h2.textContent = postagem.nome_usuario; // Substitua pelo nome real do usuário
        postHeaderDiv.appendChild(h2);

        const postContentDiv = document.createElement('div');
        postContentDiv.classList.add('post-content');

        const p = document.createElement('p');
        p.textContent = postagem.texto; // Substitua pelo conteúdo real da postagem
        postContentDiv.appendChild(p);

        // Exibir likes
        const likesSpan = document.createElement('span');
        likesSpan.setAttribute("class", "likesSpan")
        likesSpan.textContent = `CURTIU: ${postagem.likes}`;
        postContentDiv.appendChild(likesSpan);

        // Exibir dislikes
        const dislikesSpan = document.createElement('span');
        dislikesSpan.setAttribute("class", "dislikesSpan")
        dislikesSpan.textContent = `NÃO CURTIU: ${postagem.deslike}`;
        postContentDiv.appendChild(dislikesSpan);

        // Exibir comentários
        if (postagem.comentarios.length > 0) {
            const comentariosLabel = document.createElement('label');
            comentariosLabel.textContent = `Ver Comentários (${postagem.comentarios.length})`;
            comentariosLabel.classList.add('ver-comentarios-btn');
            postContentDiv.appendChild(comentariosLabel);

            const comentariosContainer = document.createElement('div');
            comentariosContainer.classList.add('comentarios-container', 'hidden');

            postagem.comentarios.forEach(comentario => {
                const comentarioP = document.createElement('p');
                comentarioP.textContent = `${comentario.nome_usuario}: ${comentario.texto}`;
                comentariosContainer.appendChild(comentarioP);
            });

            postContentDiv.appendChild(comentariosContainer);
        }

        // Input para comentar
        const comentarioInput = document.createElement('input');
        comentarioInput.setAttribute("class", "fazerComentario")
        comentarioInput.type = 'text';
        comentarioInput.placeholder = 'Comentar...';
        comentarioInput.classList.add('comentario-input');
        postContentDiv.appendChild(comentarioInput);

        const postFooterDiv = document.createElement('div');
        postFooterDiv.classList.add('post-footer');

        // Botão de Like
        const likeBtn = document.createElement('button');
        likeBtn.textContent = 'Like';
        likeBtn.setAttribute("id", "btn_estilo")
        likeBtn.addEventListener('click', function () {
            darLike(postId); // Usando o postId correto
        });
        likeBtn.setAttribute("class", "like-btn"); // Corrigindo a classe do botão
        postFooterDiv.appendChild(likeBtn);

        // Botão de Dislike
        const dislikeBtn = document.createElement('button');
        dislikeBtn.textContent = 'Dislike';
        dislikeBtn.setAttribute("id", "btn_estilo")
        dislikeBtn.addEventListener('click', function () {
            darDeslike(postId); // Usando o postId correto
        });
        dislikeBtn.setAttribute("class", "dislike-btn"); // Corrigindo a classe do botão
        postFooterDiv.appendChild(dislikeBtn);

        // Botão de Comentar
        const comentarBtn = document.createElement('button');
        comentarBtn.textContent = 'Comentar';
        comentarBtn.setAttribute("id", "btn_estilo")
        comentarBtn.addEventListener('click', function () {
            // Abrir o campo de comentário
            const comentarioInput = postDiv.querySelector('.comentario-input');
            comentarioInput.style.display = 'block';
        });
        comentarBtn.setAttribute("class", "comentar-btn"); // Corrigindo a classe do botão
        postFooterDiv.appendChild(comentarBtn);

        postDiv.appendChild(postHeaderDiv);
        postDiv.appendChild(postContentDiv);
        postDiv.appendChild(postFooterDiv);

        feedContainer.appendChild(postDiv);
    });

}


// Função para comentar em uma postagem
function comentar(postId, comentario) {
    const idUsuarioParaFoto = localStorage.getItem('idUsuario');
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    // Enviar requisição para API para adicionar o comentário à postagem
    fetch(`https://api-mini.onrender.com/api/publicacoes/${postId}/comentar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ texto: comentario, usuario_id: idUsuarioParaFoto, nome_usuario: nomeUsuario })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar comentário');
            }
            return response.json();
        })
        .then(data => {
            window.location.reload(); // atualiza a pagina quando enviar uma postagem
            // Se necessário, atualize a interface do usuário para refletir o novo comentário
            console.log('Comentário adicionado com sucesso:', data);
        })
        .catch(error => {
            console.error('Erro ao adicionar comentário:', error);
        });
}

// Função para dar like em uma postagem
function darLike(postId) {
    // Enviar requisição para API para adicionar um like à postagem
    // Substitua 'http://localhost:3000/api/like' pela sua rota de adição de like
    fetch(`https://api-mini.onrender.com/api/publicacoes/${postId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId: postId }) // Aqui está o erro, postId precisa ser passado corretamente
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar like');
            }
            return response.json();
        })
        .then(data => {
            window.location.reload(); // atualiza a pagina quando enviar uma postagem
            // Se necessário, atualize a interface do usuário para refletir o novo like
            console.log('Like adicionado com sucesso:', data);
        })
        .catch(error => {
            console.error('Erro ao adicionar like:', error);
        });
}


// Função para remover like de uma postagem
function darDeslike(postId) {
    // Enviar requisição para API para remover um like da postagem
    // Substitua 'http://localhost:3000/api/dislike' pela sua rota de remoção de like
    fetch(`https://api-mini.onrender.com/api/publicacoes/${postId}/dislike`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId: postId }) // Aqui está o erro, postId precisa ser passado corretamente
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao dar deslike');
            }
            return response.json();
        })
        .then(data => {
            window.location.reload(); // atualiza a pagina quando enviar uma postagem
            // Se necessário, atualize a interface do usuário para refletir o novo like
            console.log('deslike adicionado com sucesso:', data);
        })
        .catch(error => {
            console.error('Erro ao dar deslike like:', error);
        });
}


// Event listener para os botões de comentar
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('comentar-btn')) {
        const comentarioInput = event.target.closest('.post').querySelector('.comentario-input');
        comentarioInput.style.display = 'block'; // Mostra o input de comentário
    }
});
