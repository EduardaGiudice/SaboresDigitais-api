const express = require("express");
const { exigirLogin } = require("../Controllers/usuarioController");
const router = express.Router();
const {
  novoComentarioController,
  quantidadeComentariosController,
  listarComentariosController,
} = require("../Controllers/comentarioController");

//Listar Comentarios
router.get("/listarComentarios/:postId", exigirLogin, listarComentariosController);

//Adicionar Novo Comentário
router.post("/novoComentario/:postId", exigirLogin, novoComentarioController);

// Contar os comentários de um post
router.get(
  "/numComentarios/:postId",
  exigirLogin,
  quantidadeComentariosController
); 

module.exports = router;
