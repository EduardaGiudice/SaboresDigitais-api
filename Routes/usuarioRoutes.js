const express = require("express");
const {
  registroController,
  loginController,
  atualizarUsuarioController,
  dadosUsuarioController,
  atualizarSenhaController,
  exigirLogin,
} = require("../Controllers/usuarioController");


const router = express.Router();
const upload = require("../Config/multer");

//Rotas

//Registro de usuario
router.post("/registro", registroController);

//Login de usuario
router.post("/login", loginController);

//Atualizar dados do usuario
router.put(
  "/atualizarUsuario",
  upload.single("imagemPerfil"),
  exigirLogin,
  atualizarUsuarioController
);

//Listar dados do usuário
router.get("/dadosUsuario", exigirLogin, dadosUsuarioController);

//Alterar Senha
router.put(
  "/atualizarSenha",
  exigirLogin,
  atualizarSenhaController
);


module.exports = router;
