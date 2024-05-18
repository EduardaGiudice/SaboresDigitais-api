const comentarioModel = require("../Models/comentarioModel");

// Lista os comentários pelo ID do post
const listarComentariosByPostId = async (req, res) => {
  try {
    // Obtém o ID do post
    const postId = req.params.postId;
    // Encontra os comentários relacionados ao post
    const comentarios = await comentarioModel
      .find({ post: postId })
      .populate("usuario");
    // Retorna os comentários em formato JSON na resposta
    res.json({ comentarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Adiciona um novo comentário ao post
const addComentario = async (req, res) => {
  try {
    // Obtém o comentário do corpo da solicitação e o ID do post
    const { comentario } = req.body;
    const { postId } = req.params;

    // Obtém o ID do usuário a partir do token de autenticação
    const usuarioId = req.auth._id;

    // Cria uma nova instância de Comentário com os dados fornecidos
    const novoComentario = new comentarioModel({
      comentario,
      post: postId,
      usuario: usuarioId,
    });

    // Salva o novo comentário no bd
    await novoComentario.save();
    res.status(201).json({ message: "Comentário adicionado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter a quantidade de comentários por ID do post
const quantidadeComentariosController = async (req, res) => {
  try {
    // Obtém o ID do post
    const { postId } = req.params;

    // Conta o número de documentos (comentários) relacionados ao post
    const comentariosCount = await comentarioModel.countDocuments({
      post: postId,
    });
    // Retorna o número de comentários em formato JSON na resposta
    res.status(200).json({ comentariosCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: error.message});
  }
};

module.exports = {
  addComentario,
  listarComentariosByPostId,
  quantidadeComentariosController,
};
