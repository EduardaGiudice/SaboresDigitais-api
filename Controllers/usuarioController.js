const JWT = require("jsonwebtoken");
const cloudinary = require("../Config/cloudinary");
const fs = require("fs");
const { hashSenha, compararSenha } = require("../Helpers/authHelper");
const usuarioModel = require("../Models/usuarioModel");
var { expressjwt: jwt } = require("express-jwt");

// Middleware para exigir autenticação
const exigirLogin = jwt({
  secret: process.env.JWT_SECRET, // Chave secreta para assinar e verificar tokens JWT
  algorithms: ["HS256"], // Algoritmo utilizado para assinar tokens JWT
});

// Registro do usuário
const registroController = async (req, res) => {
  try {
    // Extrair informações do corpo da requisição
    const { nomeUsuario, email, senha } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes e a senha tem pelo menos 6 caracteres
    if (!nomeUsuario || !email || !senha || senha.length < 6) {
      return res.status(400).send({
        success: false,
        message:
          "Nome, email e senha são obrigatórios e a senha deve ter pelo menos 6 caracteres",
      });
    }

    // Confirmando se já existe um usuário com o mesmo email
    const usuarioExistente = await usuarioModel.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).send({
        success: false,
        message: "Já existe um usuário com esse email",
      });
    }

    // Hash da senha antes de salvar no banco de dados
    const hashedSenha = await hashSenha(senha);

    // Criar um novo usuário no bd
    const usuario = await usuarioModel.create({
      nomeUsuario,
      email,
      senha: hashedSenha,
    });

    // Retorna uma resposta de sucesso
    return res.status(201).send({
      success: true,
      message: "Registrado com sucesso, faça seu login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Erro ao registrar",
      error,
    });
  }
};

// Login do usuário
const loginController = async (req, res) => {
  try {
    // Obtém informações do corpo da requisição
    const { email, senha } = req.body;

    // Verificar se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).send({
        success: false,
        message: "Por favor, digite seu email e senha",
      });
    }

    // Encontrar o usuário com o email fornecido
    const usuario = await usuarioModel.findOne({ email });
    if (!usuario) {
      return res.status(400).send({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    // Comparar a senha fornecida com a senha armazenada no bd
    const matchSenha = await compararSenha(senha, usuario.senha);
    if (!matchSenha) {
      return res.status(400).send({
        success: false,
        message: "Email e senha inválidos",
      });
    }

    // Gerar token JWT para autenticação
    const token = await JWT.sign({ _id: usuario._id }, process.env.JWT_SECRET);

    // Remover a senha do usuário da resposta
    usuario.senha = undefined;

    // Retorna uma resposta de sucesso
    return res.status(200).send({
      success: true,
      token,
      usuario,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Erro no Login",
      error,
    });
  }
};

//atualizar usuario

const atualizarUsuarioController = async (req, res) => {
  try {
    const { nomeUsuario, senha, email } = req.body;

    // Encontrar o usuário pelo email
    const usuario = await usuarioModel.findOne({ email });

    // Validar senha se fornecida
    if (senha && senha.length < 6) {
      return res.status(400).send({
        success: false,
        message: "A senha é obrigatória e deve ter no mínimo 6 caracteres",
      });
    }

    let imagemPerfilUrl = usuario.imagemPerfil;
    let cloudinaryId = usuario.cloudinary_id;

    // Se uma nova imagem foi fornecida, faça o upload para o Cloudinary
    if (req.file) {
      // Excluir a imagem anterior do Cloudinary, se existir
      if (cloudinaryId) {
        await cloudinary.uploader.destroy(cloudinaryId);
      }

      // Fazer upload da nova imagem
      const result = await cloudinary.uploader.upload(req.file.path);

      // Inicializar variáveis para armazenar a URL da imagem de perfil e o ID do Cloudinary
      imagemPerfilUrl = result.secure_url;
      cloudinaryId = result.public_id;

      // Exclua o arquivo temporário após o upload
      fs.unlinkSync(req.file.path);
    }

    // Hash da nova senha, se fornecida
    const senhaHashed = senha ? await hashSenha(senha) : undefined;

    // Atualizar o perfil do usuário no bd
    const atualizarUsuario = await usuarioModel.findOneAndUpdate(
      { email }, // Critério de busca: email
      {
        nomeUsuario: nomeUsuario || usuario.nomeUsuario,
        senha: senhaHashed || usuario.senha,
        imagemPerfil: imagemPerfilUrl,
        cloudinary_id: cloudinaryId,
      },
      { new: true }
    );

    // Responder com sucesso e o novo objeto de usuário atualizado
    res.status(200).send({
      success: true,
      message: "Perfil atualizado com sucesso",
      atualizarUsuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erro ao atualizar o perfil do usuário",
      error,
    });
  }
};

const atualizarSenhaController = async (req, res) => {
  try {
    const { senhaAtual, novaSenha, confirmarNovaSenha } = req.body;

    // Verificar se a nova senha e a confirmação são iguais
    if (novaSenha !== confirmarNovaSenha) {
      return res.status(400).send({
        success: false,
        message: "A nova senha e a confirmação não coincidem",
      });
    }

    // Encontrar usuário
    const usuario = await usuarioModel.findById(req.auth._id);

    // Comparar a senha atual fornecida com a senha do usuário no banco de dados
    const matchSenha = await compararSenha(senhaAtual, usuario.senha);
    if (!matchSenha) {
      return res.status(400).send({
        success: false,
        message: "Senha atual incorreta",
      });
    }

    // Hash da nova senha
    const novaSenhaHashed = await hashSenha(novaSenha);

    // Atualizar a senha do usuário
    usuario.senha = novaSenhaHashed;
    await usuario.save();

    // Retorna uma resposta de sucesso
    return res.status(200).send({
      success: true,
      message: "Senha atualizada com sucesso",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Erro ao atualizar a senha",
      error,
    });
  }
};

const dadosUsuarioController = async (req, res) => {
  try {
    const usuarioId = req.auth._id; // ID do usuário extraído do token JWT

    // Encontrar o usuário pelo ID
    const usuario = await usuarioModel.findById(usuarioId);

    // Verificar se o usuário foi encontrado
    if (!usuario) {
      return res.status(404).send({
        success: false,
        message: "Usuário não encontrado",
      });
    }
    // Retornar os dados do usuário
    return res.status(200).send({
      success: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Erro ao buscar dados do usuário",
      error,
    });
  }
};




module.exports = {
  registroController,
  loginController,
  atualizarUsuarioController,
  dadosUsuarioController,
  atualizarSenhaController,
  exigirLogin,
};
