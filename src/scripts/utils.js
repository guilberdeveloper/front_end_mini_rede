import User from "./user.js";
const usuario = new User();


// funcao para fazer o login
async function fazerLogin(email, password){
    console.log(email, password)
    if(email != "" && password != ""){
        usuario.login(email, password);
    }
}

async function fazerCadastroUsuario(name, email, password, confirmPassword, foto){
    if (password !== confirmPassword) {
        console.error('As senhas não coincidem.');
        return;
    }else{
        await usuario.criarConta(name, email, password, confirmPassword, foto);
    }
}

export  {fazerLogin ,fazerCadastroUsuario}
