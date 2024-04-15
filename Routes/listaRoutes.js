const express = require("express");
const { exigirLogin } = require("../Controllers/usuarioController");
const {
  adicionarItemController,
  listarItensController,
  removerItemController,
  limparListaController,
} = require("../Controllers/listaController");

const router = express.Router();

//Adicionar novo Item
router.post("/adicionarItem", exigirLogin, adicionarItemController);

//Listar itens da lista de compras
router.get("/listarItens", exigirLogin, listarItensController);

//Remover item da lista de compras
router.delete("/removerItem/:id", exigirLogin, removerItemController);

//Remover todos os itens da lista de compras
router.delete("/limparLista", exigirLogin, limparListaController);

module.exports = router;
