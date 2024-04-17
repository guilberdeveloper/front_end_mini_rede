const searchInput = document.getElementById('input_pesquisar_amigo');
const searchResultsContainer = document.getElementById('searchResultsContainer');

let amigosExibidos = []; // Array para armazenar os IDs dos amigos já exibidos

document.getElementById('btn_procurar_amigo').addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token de autorização não encontrado.');
                return;
            }

            const response = await fetch(`https://api-mini-rede-social.onrender.com/api/pessoas?name=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar usuários');
            }

            const data = await response.json();
            renderUsers(data);

            
            //localStorage.setItem("usuarioPesquisado", )
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    }
});


function pegarFotoUsuario(idUsuario) {
    return new Promise((resolve, reject) => {
        // Faça a requisição HTTP GET para a rota no backend
        fetch(`http://localhost:3000/api/foto/${idUsuario}`)
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

async function renderUsers(users) {
    searchResultsContainer.innerHTML = ''; // Limpa os resultados anteriores

    if (users.length === 0) {
        console.log('Nenhum usuário encontrado.');
        return;
    }
    console.log("busca de amigos",users)
    // Renderiza os novos resultados
    for (const user of users) {
        // Verifica se o usuário já foi exibido
        const alreadyDisplayed = amigosExibidos.includes(user.id);
        console.log("console logo date", user._id)
        const idUsuarioPesquisado = localStorage.setItem('usuarioPesquisado', user._id);
        // Se o usuário ainda não foi exibido, renderiza-o
        if (!alreadyDisplayed) {
            const userDiv = document.createElement('div');
            userDiv.classList.add('searchResultItem');

            const userFoto = document.createElement('img');
            userFoto.src = `https://api-mini-rede-social.onrender.com/api/foto/${user._id}`
            userDiv.appendChild(userFoto)

            // Adiciona o nome do usuário
            const userName = document.createElement('span');
            userName.textContent = user.name;
            userDiv.appendChild(userName);

            // Verifica se o usuário já é amigo
            const isFriend = await checkIfFriend(user.id);
            // Adiciona o botão para adicionar amigo apenas se o usuário não for amigo
            if (!isFriend) {
                const addFriendButton = document.createElement('button');
                addFriendButton.setAttribute("class", "addFriendButton")
                addFriendButton.textContent = 'Adicionar amigo';
                addFriendButton.addEventListener('click', async () => {
                    // Lógica para adicionar o usuário como amigo
                   
                    try {
                        const idUsuarioAtual = localStorage.getItem('idUsuario');
                        const idUsuarioPesquisado = localStorage.getItem('usuarioPesquisado');
                        const response = await fetch('https://api-mini-rede-social.onrender.com/api/addAmigo', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "usuario_id": idUsuarioAtual, "amigo_id": idUsuarioPesquisado })
                        });
                        
                        console.log(idUsuarioPesquisado)
                        if (!response.ok) {
                            throw new Error('Erro ao adicionar amigo');
                        }
                        
                        const data = await response.json();
                        window.location.reload();
                        
                        console.log(data.message); // Exibe uma mensagem de sucesso no console
                        // Adiciona o ID do amigo ao div do usuário para que possa ser recuperado posteriormente
                        userDiv.dataset.friendId = user.id;
                        // Remove o botão após adicionar o amigo
                        userDiv.removeChild(addFriendButton);
                        // Adiciona mensagem indicando que o usuário agora é um amigo
                        const addedFriendMsg = document.createElement('span');
                        addedFriendMsg.textContent = ' (Adicionado como amigo)';
                        userDiv.appendChild(addedFriendMsg);

                        // Adiciona o ID do amigo aos amigos exibidos
                        amigosExibidos.push(user.id);
                    } catch (error) {
                        console.error('Erro ao adicionar amigo:', error);
                    }
                });

                userDiv.appendChild(addFriendButton);
            } else {
                // Se o usuário já for um amigo, exibe uma mensagem indicando que ele já é um amigo
                const alreadyFriendMsg = document.createElement('span');
                alreadyFriendMsg.textContent = ' (Já é seu amigo)';
                userDiv.appendChild(alreadyFriendMsg);
            }

            // Adicionando evento de clique para selecionar o usuário
            userDiv.addEventListener('click', () => {
                console.log(`Usuário selecionado: ${user.name}`);
                // Lógica para lidar com a seleção do usuário
                // Aqui você pode obter o ID do amigo adicionado usando userDiv.dataset.friendId
            });

            searchResultsContainer.appendChild(userDiv);

            // Adiciona o ID do usuário aos amigos exibidos
            amigosExibidos.push(user.id);
        }
    }

    // Exibe o contêiner de resultados
    searchResultsContainer.style.display = 'block';
}

// Função para verificar se o usuário já é um amigo
async function checkIfFriend(userId) {
    const idUsuarioPesquisado = localStorage.getItem('usuarioPesquisado');
    try {
        const response = await fetch(`https://api-mini-rede-social.onrender.com/api/checkAmigo?userId=${idUsuarioPesquisado}&friendId=${userId}`);
        if (!response.ok) {
            throw new Error('Erro ao verificar se é amigo');
        }
        const data = await response.json();
        return data.isFriend;
    } catch (error) {
        console.error('Erro ao verificar se é amigo:', error);
        return false;
    }
}


// Fecha o contêiner de resultados ao clicar fora dele
document.addEventListener('click', (event) => {
    if (!searchResultsContainer.contains(event.target)) {
        searchResultsContainer.style.display = 'none';
    }
});


/* codigo que funciona

document.getElementById('btn_procurar_amigo').addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        try {
            const response = await fetch(`http://localhost:3000/api/pessoas?name=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar usuários');
            }
            const data = await response.json();
            renderUsers(data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    }
});

function renderUsers(users) {
    searchResultsContainer.innerHTML = ''; // Limpa os resultados anteriores
    // Renderiza os novos resultados
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('searchResultItem');
        
        // Adicionando o nome do usuário
        const userName = document.createElement('span');
        userName.textContent = user.name;
        userDiv.appendChild(userName);

        // Adicionando o botão para adicionar amigo
        const addFriendButton = document.createElement('button');
        addFriendButton.textContent = 'Adicionar amigo';
        addFriendButton.addEventListener('click', async () => {
            // Lógica para adicionar o usuário como amigo
            const idUsuarioAtual = localStorage.getItem('idUsuario');
            try {
                const response = await fetch('http://localhost:3000/api/addAmigo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: idUsuarioAtual, friendId: user.id })
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao adicionar amigo');
                }
                
                const data = await response.json();
                
                console.log(data.message); // Exibe uma mensagem de sucesso no console
                // Adiciona o ID do amigo ao div do usuário para que possa ser recuperado posteriormente
                userDiv.dataset.friendId = user.id;
            } catch (error) {
                console.error('Erro ao adicionar amigo:', error);
            }
        });

        userDiv.appendChild(addFriendButton);

        // Adicionando evento de clique para selecionar o usuário
        userDiv.addEventListener('click', () => {
            console.log(`Usuário selecionado: ${user.name}`);
            // Lógica para lidar com a seleção do usuário
            // Aqui você pode obter o ID do amigo adicionado usando userDiv.dataset.friendId
        });

        searchResultsContainer.appendChild(userDiv);
    });
    // Exibe o contêiner de resultados
    searchResultsContainer.style.display = 'block';
}

// Fecha o contêiner de resultados ao clicar fora dele
document.addEventListener('click', (event) => {
    if (!searchResultsContainer.contains(event.target)) {
        searchResultsContainer.style.display = 'none';
    }
});


*/