const listaModel = require("../Models/listaModel");

// Adicionar um novo item à lista
 const adicionarItemController = async (req, res) => {
  try {
    // Obtém os dados de item do corpo da solicitação
    const { quantidade, unidadeMedida, nomeItem } = req.body;
    // Obtém o ID do usuário logado
    const usuario_id = req.auth._id;
    // Cria uma nova instância de item da lista com os dados fornecidos
    const newItem = new listaModel({
      quantidade,
      unidadeMedida,
      nomeItem,
      usuario_id,
    });
    // Salva o novo item no bd
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Listar todos os itens da lista de compras
 const listarItensController = async (req, res) => {
  try {
    // Obtém o ID do usuário logado
    const usuario_id = req.auth._id;
    // Encontra todos os itens da lista que pertencem usuário logado
    const itens = await listaModel.find({ usuario_id });
    // Retorna os itens da lista em formato JSON na resposta
    res.status(200).json({ success: true, data: itens });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remover um item da lista de compras
 const removerItemController = async (req, res) => {
  try {
    // Obtém o ID do item a ser removido
    const id = req.params.id;
    // Encontra e remove o item da lista pelo ID
    await listaModel.findByIdAndDelete(id);
    // Retorna uma resposta de sucesso
    res
      .status(200)
      .json({ success: true, message: "Item removido com sucesso" });
  } catch (err) {
    res.status(404).json({ success: false, error: "Item não encontrado" });
  }
};

// Limpar toda a lista de compras
    const limparListaController = async (req, res) => {
  try {
    // Obtém o ID do usuário logado
    const usuario_id = req.auth._id;
    // Remove todos os itens da lista pertencentes ao usuário
    await listaModel.deleteMany({ usuario_id });
    // Retorna uma resposta de sucesso indicando que a lista foi limpa com sucesso
    res.status(200).json({ success: true, message: "Lista limpa com sucesso" });
  } catch (error) {
    res.status(500).json({ success: false, error: message.error });
  }
};

module.exports = {
adicionarItemController,
listarItensController,
removerItemController,
limparListaController
};
