// comentarioController.js
const comentarioModel = require("../Models/comentarioModel");

const getComentariosByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comentarios = await comentarioModel.find({ post: postId }).populate(
      "usuario"
    );
    res.json({ comentarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addComentario = async (req, res) => {
  try {
    const { comentario } = req.body;
const { postId } = req.params
    const usuarioId = req.auth._id; // Assuming you have authentication middleware
    const novoComentario = new comentarioModel({
      comentario,
      post: postId,
      usuario: usuarioId,
    });

    await novoComentario.save();
    res.status(201).json({ message: "Comentário adicionado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
addComentario,
getComentariosByPostId,
};
