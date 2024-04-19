export default class User {

    constructor(name, email, password, confirmPassword) {
        this.name = name;
        this.email = email;
        this.senha = password;
        this.confirmPassword = confirmPassword;
    }

    async criarConta(name, email, password, confirmPassword, foto) {
        if (!name || !email || !password || !confirmPassword || !foto) {
            console.error('Todos os campos são obrigatórios.');
            return;
        }

        if (password !== confirmPassword) {
            console.error('As senhas não coincidem.');
            return;
        }

        // Verificar se o email tem um formato válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('O email inserido não é válido.');
            return;
        }

        // Construir um FormData para enviar os dados
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        formData.append('fotoUsuario', foto);

        try {
            const response = await fetch('https://api-mini.onrender.com/api/cadastro', {
                method: 'post',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ocorreu um erro ao cadastrar. Código de status: ' + response.status);
            }
            const cadastradoComSucesso = document.getElementById("cadastradoComSucesso")
            const responseData = await response.json();
            console.log('Cadastro realizado com sucesso:', responseData);

            setTimeout(()=> {
                cadastradoComSucesso.style.display = "block"
                document.querySelector('.loading-spinner').style.display = 'block';
            },3000)
            window.location.href = "../../index.html";
           
        } catch (error) {
            console.error('Erro ao cadastrar:', error.message);
        }
    }

    login(email, password) {
        if (!email || !password) {
            console.error('E-mail e senha são obrigatórios.');
            return;
        }

        const endpoint = "https://api-mini.onrender.com/api/login";

        let dados = {
            email: email,
            password: password
        };

        let cabecalho = {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        };

        fetch(endpoint, cabecalho)
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error("Erro ao fazer Login");
                }
                return resposta.json();
            })
            .then(retorno => {
                const idUsuario = retorno.id;
                const nomeUsuario = retorno.name;
                const token = retorno.token;
                const foto = retorno.fotoUsuario.data;

                localStorage.setItem('idUsuario', idUsuario);
                localStorage.setItem('nomeUsuario', nomeUsuario);
                localStorage.setItem('token', token);

                sessionStorage.setItem('idUsuario', idUsuario);
                sessionStorage.setItem('nomeUsuario', nomeUsuario);
                sessionStorage.setItem('token', token);

                console.log("Foto URL:", retorno.fotoUsuario.data);

                this.fotoUser();

                setTimeout(() => {
                    window.location.href = "/src/screens/home.html";
                }, 3000);
            })
            .catch(error => {
                document.querySelector('.loading-spinner').style.display = 'none';
                alert("Senha ou E-mail inválido")
                console.error("Erro:", error);
            });
    }

    fotoUser() {
        const idUsuarioParaFoto = localStorage.getItem('idUsuario');
        if (!idUsuarioParaFoto) {
            console.error('ID do usuário não encontrado no armazenamento local.');
            return;
        }

        fetch(`/api/user/foto/${idUsuarioParaFoto}`)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Erro ao carregar a foto do usuário');
            })
            .then(blob => {
                const fotoURL = URL.createObjectURL(blob);
                const img = document.createElement('img');
                img.src = fotoURL;
                document.body.appendChild(img);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
