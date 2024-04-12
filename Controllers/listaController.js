const listaModel = require("../Models/listaModel");

// Controlador para adicionar um novo item à lista
 const adicionarItemController = async (req, res) => {
  try {
    const { quantidade, unidadeMedida, nomeItem } = req.body;
    const donoLista = req.auth._id; 
    const newItem = new listaModel({
      quantidade,
      unidadeMedida,
      nomeItem,
      donoLista,
    });
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Controlador para listar todos os itens da lista
 const listarItensController = async (req, res) => {
  try {
    const donoLista = req.auth._id; // Obtendo o ID do usuário logado
    const itens = await listaModel.find({ donoLista });
    res.status(200).json({ success: true, data: itens });
  } catch (err) {
    res.status(500).json({ success: false, error: "Erro interno do servidor" });
  }
};

// Controlador para remover um item da lista
 const removerItemController = async (req, res) => {
  try {
    const id = req.params.id;
    await listaModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Item removido com sucesso" });
  } catch (err) {
    res.status(404).json({ success: false, error: "Item não encontrado" });
  }
};

// Controlador para limpar toda a lista
    const limparListaController = async (req, res) => {
  try {
    const donoLista = req.auth._id; // Obtendo o ID do usuário logado
    await listaModel.deleteMany({ donoLista });
    res.status(200).json({ success: true, message: "Lista limpa com sucesso" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Erro interno do servidor" });
  }
};

module.exports = {
adicionarItemController,
listarItensController,
removerItemController,
limparListaController
};
