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

const {adicionarComentarioController, listarComentariosController} = require("../Controllers/comentarioController")

const storage = require("../Config/multer");
const multer = require("multer");

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

router.post("/like/:postId", exigirLogin, likePostController);
router.get("/checkLike/:postId", exigirLogin, checkLikeController); // Rota para verificar se o usuário curtiu um post
router.get("/numLikes/:postId", quantidadeLikesController); // Rota para contar as curtidas de um post
router.delete("/dislike/:postId", exigirLogin, dislikePostController); // Rota para descurtir um post

//Buscar por nome da Receita
router.get("/buscarPorNome/:nomeReceita", buscarPorNomeController);



module.exports = router;
