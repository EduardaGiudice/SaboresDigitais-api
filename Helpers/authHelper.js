const bcrypt = require('bcrypt')

// Função para gerar o hash de uma senha
exports.hashSenha = (senha) => {
    return new Promise((resolve,reject ) => {
        bcrypt.genSalt(10,(err,salt) => {
            if(err){
                reject(err)
            }
            bcrypt.hash(senha, salt, (err,hash) => {
                if(err){
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

// Função para comparar uma senha fornecida com um hash
exports.compararSenha = (senha, hashed) =>{
    return bcrypt.compare(senha, hashed)
}