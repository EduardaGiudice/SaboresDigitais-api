const express = require("express");
const { exigirLogin } = require("../Controllers/usuarioController");
const {
  novoPostController,
  listarPostsController,
  listarMeusPostsController,
  deletarPostController,
  atualizarPostController,
  buscarPorNomeController,
  likePostController,
  checkLikeController,
  quantidadeLikesController,
  dislikePostController,
} = require("../Controllers/postController");

const router = express.Router();
const upload = require('../Config/multer')

//Criar post
router.post(
  "/novoPost",
  upload.single("imagemReceita"),
  exigirLogin,
  novoPostController
);

//Listar todos os posts
router.get("/posts", listarPostsController);

//Listar os posts do usuario
router.get("/meusPosts", exigirLogin, listarMeusPostsController);

//Deletar Post
router.delete("/deletarPost/:id", exigirLogin, deletarPostController);

//Atualizar Post
router.put(
  "/atualizarPost/:id",
  upload.single("imagemReceita"),
  exigirLogin,
  atualizarPostController
);

//Buscar por nome da Receita
router.get("/buscarPorNome/:nomeReceita", exigirLogin, buscarPorNomeController);

//Curtir Post
router.post("/like/:postId", exigirLogin, likePostController);

// Verificar se o usuario curtiu um post
router.get("/checkLike/:postId", exigirLogin, checkLikeController);

 // Contar as curtidas de um post
router.get("/numLikes/:postId", exigirLogin, quantidadeLikesController);

// Descurtir um post
router.delete("/dislike/:postId", exigirLogin, dislikePostController);

module.exports = router;
