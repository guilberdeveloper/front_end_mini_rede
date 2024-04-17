// script para contralar a exibicao dos formulários
const btn_register_formulario_login = document.getElementById("btn_register_formulario_login");
const btn_cadastrar_formulario_register = document.getElementById("btn_cadastrar_formulario_register");
const btn_entrar = document.getElementById("btn_entrar");




import {fazerCadastroUsuario, fazerLogin} from "./utils.js";

// Evento geral para verificacoes
window.addEventListener("load", () => {
    
    // decide qual painel vem aberto 
    const form_register = document.getElementById("form_register");
    form_register.style.display = "none"; // esconde form cadastro logo de inicio
})




//Evento do btn formulario de login
btn_register_formulario_login.addEventListener("click", (e) => {
    e.preventDefault();

    const form_container = document.getElementById("form_container");
    const form_login = document.getElementById("form_login");
    const form_register = document.getElementById("form_register");
    form_login.style.display = "none"; // esconde form login
    form_container.style.height = "600px";
    form_register.style.display = "flex"; // revela form cadastro

})


//Evento do btn cadastrar usuario
btn_cadastrar_formulario_register.addEventListener("click", (e) => {
    e.preventDefault();

    // Reunir dados do formulário
    const name = document.getElementById('name_input').value;
    const email = document.getElementById('email_input').value;
    const password = document.getElementById('password_input_cadastro').value;
    const confirmPassword = document.getElementById('confirm_password_input').value;
    const fotoUsuario = document.getElementById('photo_input');
    const foto = fotoUsuario.files[0]; // Obtém o arquivo de foto


    // Verificando se senha e confirmacao de senha sao identicas

    if (password !== confirmPassword) {
        console.log("senha diferente")
    } else {
        console.log("usuario cadastrado")
        fazerCadastroUsuario(name, email, password, confirmPassword, foto)
    }
})


// evento botao login
btn_entrar.addEventListener("click", (e) => {
    e.preventDefault()

    // campos formulario Login
    const inputEmailLogin = document.getElementById("email").value;
    const inputSenhaLogin = document.getElementById("password_input").value;
    document.querySelector('.loading-spinner').style.display = 'block';
    
    fazerLogin(inputEmailLogin,inputSenhaLogin);

    
})


document.getElementById('btn_fazerLogin_form_cadastro').addEventListener('click', function() {
    // Redirecionar para a página de login ao clicar no botão
    window.location.href = '../../index.html';
});