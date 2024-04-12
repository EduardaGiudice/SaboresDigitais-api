const express = require("express");
const { exigirLogin } = require("../Controllers/usuarioController");
const {
  adicionarItemController,
  listarItensController,
  removerItemController,
  limparListaController,
} = require("../Controllers/listaController");

const router = express.Router();

router.post("/adicionarItem", exigirLogin, adicionarItemController);
router.get("/listarItens", exigirLogin, listarItensController);
router.delete("/removerItem/:id", removerItemController);
router.delete("/limparLista", exigirLogin, limparListaController);

module.exports = router;
