// routes/comentarioRoutes.js
const express = require("express");
const { exigirLogin } = require("../Controllers/usuarioController");
const router = express.Router();
const {
  addComentario,
  getComentariosByPostId,
} = require("../Controllers/comentarioController");
router.get("/:postId", exigirLogin, getComentariosByPostId);
router.post("/:postId", exigirLogin, addComentario);

module.exports = router;
