const bcrypt = require("bcrypt");

// Função para gerar o hash de uma senha
exports.hashSenha = (senha) => {
  return new Promise((resolve, reject) => {
    // Gera um "salt" para adicionar aleatoriedade ao processo de hashing
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        // Se houver um erro ao gerar o salt, rejeita a Promise com o erro
        reject(err);
      }
      // Usa o salt gerado para criar o hash da senha
      bcrypt.hash(senha, salt, (err, hash) => {
        if (err) {
          // Se houver um erro ao gerar o hash, rejeita a Promise com o erro
          reject(err);
        }
        // Se o hash for gerado com sucesso, resolve a Promise com o hash resultante
        resolve(hash);
      });
    });
  });
};
// Função para comparar uma senha fornecida com um hash
exports.compararSenha = (senha, hashed) => {
  // Compara a senha fornecida com o hash usando o método compare do bcrypt
  return bcrypt.compare(senha, hashed);
};
