const express = require("express");
const { exigirLogin } = require("../Controllers/usuarioController");
const router = express.Router();
const {
  addComentario,
  getComentariosByPostId,
  quantidadeComentariosController,
} = require("../Controllers/comentarioController");

//Listar Comentarios
router.get("/listarComentarios/:postId", exigirLogin, getComentariosByPostId);

//Adicionar Novo Comentário
router.post("/novoComentario/:postId", exigirLogin, addComentario);

// Contar os comentários de um post
router.get(
  "/numComentarios/:postId",
  exigirLogin,
  quantidadeComentariosController
); 

module.exports = router;
