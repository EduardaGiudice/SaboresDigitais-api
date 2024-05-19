const comentarioModel = require("../Models/comentarioModel");

// Lista os comentários pelo ID do post
const listarComentariosController = async (req, res) => {
  try {
    // Obtém o ID do post a partir dos parâmetros da requisição
    const postId = req.params.postId;
    // Utiliza o comentarioModel para buscar todos os comentários associados ao ID do post
    const comentarios = await comentarioModel
      .find({ post: postId }) // Filtra os comentários pelo campo 'post' que corresponde ao postId
      .populate("usuario"); // Popula os dados do usuário que fez o comentário
    // Retorna os comentários encontrados em formato JSON na resposta
    res.json({ comentarios });
  } catch (error) {
    // Em caso de erro, retorna uma resposta com status 500 e a mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

// Adiciona um novo comentário ao post
const novoComentarioController = async (req, res) => {
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
  novoComentarioController,
  listarComentariosController,
  quantidadeComentariosController,
};
