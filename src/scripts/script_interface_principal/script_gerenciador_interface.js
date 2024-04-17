// buscar amigos
// Supondo que você já tenha o token JWT após o login
const token = localStorage.getItem('token');
const idUsuarioAtual = localStorage.getItem('idUsuario');


const userName = document.getElementById("userName");
const btn_Sair = document.getElementById("btn_Sair");
const nomeuser = localStorage.getItem("nomeUsuario");
userName.innerHTML = nomeuser

// FOTOS DO USUARIO LOGADO
const fotoUsuarioPerfil = document.getElementById("imgPerfil")




// Obtém o botão de abrir o menu e o modal do menu
const openMenuBtn = document.getElementById('openMenuBtn');
const menuModal = document.getElementById('menuModal');

// Obtém o botão de fechar o menu
//const closeMenuBtn = document.getElementById('closeMenuBtn');

const amigosARRAY = [];

// Função para abrir o modal do menu
function openMenu() {
    menuModal.style.display = 'block';
}

// Função para fechar o modal do menu
function closeMenu() {
    menuModal.style.display = 'none';
}

// Adiciona um event listener para o botão de abrir o menu
userName.addEventListener('click', openMenu);

// Adiciona um event listener para o botão de fechar o menu
closeMenuBtn.addEventListener('click', closeMenu);


btn_Sair.addEventListener("click", (e) => {
    e.preventDefault();

    // Limpa todo o conteúdo do localStorage
    localStorage.clear();

    // Limpa todo o conteúdo do sessionStorage
    sessionStorage.clear();

    // Redireciona para a página de login
    window.location.href = "../../../index.html";
});



async function buscarAmigos() {
    try {
        const response = await fetch(`http://localhost:3000/api/amigos/${idUsuarioAtual}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar amigos');
        }

        const amigos = await response.json();
        localStorage.setItem("amigosArray", JSON.stringify(amigos)); // Armazena a lista de amigos no localStorage

        // Limpa os amigos existentes
        const containerFriend = document.querySelector('.container_friend');
        containerFriend.innerHTML = '';

        // Adiciona cada amigo ao container de amigos
        amigos.forEach(async amigo => {
            const friendDiv = document.createElement('div');
            friendDiv.classList.add('friends');

            const friendContainer = document.createElement('div');
            friendContainer.classList.add('frind_container');
            friendContainer.dataset.friendId = amigo.amigo_id._id; // Adiciona o ID do amigo como um atributo 'data-id'
            friendContainer.dataset.nameAmigoId = amigo.amigo_id.name;

            const img = document.createElement('img');
            img.alt = 'Imagem do amigo';

            try {
                // Fetch da foto do usuário correspondente
                const fotoResponse = await fetch(`http://localhost:3000/api/foto/${amigo.amigo_id._id}`);
                if (fotoResponse.ok) {
                    const fotoBlob = await fotoResponse.blob();
                    const fotoURL = URL.createObjectURL(fotoBlob);
                    img.src = fotoURL || "../../../img/user.png"; // Define a imagem do amigo ou uma imagem padrão
                } else {
                    img.src = "../../../img/user.png"; // Define uma imagem padrão caso ocorra um erro
                }
            } catch (error) {
                console.error('Erro ao buscar a foto do amigo:', error);
                img.src = "../../../img/user.png"; // Define uma imagem padrão em caso de erro
            }

            const nameSpan = document.createElement('span');
            nameSpan.classList.add('name_friend');
            nameSpan.textContent = amigo.amigo_id.name; // Assume que 'name' é o nome do amigo

            const statusDiv = document.createElement('div');
            statusDiv.classList.add('status_ativo');
            statusDiv.setAttribute("id","status_ativo");

            friendContainer.appendChild(img);
            friendContainer.appendChild(nameSpan);
            friendContainer.appendChild(statusDiv);
            friendDiv.appendChild(friendContainer);
            containerFriend.appendChild(friendDiv);
        });
    } catch (error) {
        console.error('Erro ao buscar amigos:', error);
    }
}


/* funcao que funciona
// Função para buscar os amigos e colocá-los no container de amigos
async function buscarAmigos() {
    try {
        const response = await fetch(`http://localhost:3000/api/amigos/${idUsuarioAtual}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar amigos');
        }

        const amigos = await response.json();
        amigosARRAY.push(JSON.stringify(amigos));
        localStorage.setItem("amigosArray", amigosARRAY);
        console.log(amigos)
        // Coloque os amigos no container de amigos
        const containerFriend = document.querySelector('.container_friend');
        containerFriend.innerHTML = ''; // Limpa os amigos existentes

        amigos.forEach(amigo => {
            const friendDiv = document.createElement('div');
            friendDiv.classList.add('friends');

            const friendContainer = document.createElement('div');
            friendContainer.classList.add('frind_container');
            friendContainer.dataset.friendId = amigo.amigo_id; // Adiciona o ID do amigo como um atributo 'data-id'
            friendContainer.dataset.nameAmigoId = amigo.name;

            const img = document.createElement('img');
            img.src = `${pegarFotoUsuario()}`; // Substitua pelo caminho real da imagem do amigo
            img.alt = 'Foto do amigo';

            const nameSpan = document.createElement('span');
            nameSpan.classList.add('name_friend');
            nameSpan.textContent = amigo.name; // Assume que 'name' é o nome do amigo

            const statusDiv = document.createElement('div');
            statusDiv.classList.add('status_ativo');

            friendContainer.appendChild(img);
            friendContainer.appendChild(nameSpan);
            friendContainer.appendChild(statusDiv);
            friendDiv.appendChild(friendContainer);
            containerFriend.appendChild(friendDiv);
        });
    } catch (error) {
        console.error('Erro ao buscar amigos:', error);
    }
}
*/

function pegarFotoUsuario() {
    return new Promise((resolve, reject) => {
        const idUsuarioParaFoto = localStorage.getItem('idUsuario');
        // Faça a requisição HTTP GET para a rota no backend
        fetch(`http://localhost:3000/api/foto/${idUsuarioParaFoto}`)
            .then(response => {
                // Verifica se a resposta foi bem-sucedida (status 200)
                if (response.ok) {
                    // Retorna o corpo da resposta como um blob (arquivo)
                    return response.blob();
                }
                // Se a resposta não for bem-sucedida, lança um erro
                throw new Error('Erro ao carregar a foto do usuário');
            })
            .then(blob => {
                // Cria uma URL temporária para a foto
                const fotoURL = URL.createObjectURL(blob);
                // Retorna a fotoURL para uso posterior
                resolve(fotoURL);
            })
            .catch(error => {
                // Rejeita a Promise com o erro ocorrido
                reject(error);
            });
    });
}


// Chame a função pegarFotoUsuario() para obter a URL da foto do usuário
pegarFotoUsuario()
    .then(fotoURL => {
        // Atribua a URL da foto ao atributo src do elemento de imagem
        fotoUsuarioPerfil.src = fotoURL;
    })
    .catch(error => {
        // Trata qualquer erro que ocorrer durante o processo
        console.error(error);
    });

// Chame a função para buscar os amigos após o login bem-sucedido
buscarAmigos();
