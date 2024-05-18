const express = require("express");
const { exigirLogin } = require("../Controllers/usuarioController");
const router = express.Router();
const {
  addComentario,
  listarComentariosByPostId,
  quantidadeComentariosController,
} = require("../Controllers/comentarioController");

//Listar Comentarios
router.get("/listarComentarios/:postId", exigirLogin, listarComentariosByPostId);

//Adicionar Novo Comentário
router.post("/novoComentario/:postId", exigirLogin, addComentario);

// Contar os comentários de um post
router.get(
  "/numComentarios/:postId",
  exigirLogin,
  quantidadeComentariosController
); 

module.exports = router;
