const cloudinary = require("../Config/cloudinary");
const postModel = require("../Models/postModel");
const usuarioModel = require("../Models/usuarioModel")
const likeModel = require("../Models/likeModel");


const fs = require("fs");

// Criar novo post
const novoPostController = async (req, res) => {
  try {
    // Upload da imagem para o Cloudinary
    const { path } = req.file;
    const result = await cloudinary.uploader.upload(path);

    // Criação de um novo post com os dados recebidos do formulário e a URL da imagem no Cloudinary
    const post = new postModel({
      nomeReceita: req.body.nomeReceita,
      descricaoReceita: req.body.descricaoReceita,
      ingredientes: req.body.ingredientes,
      passosPreparo: req.body.passosPreparo,
      imagemReceita: result.secure_url,
      cloudinary_id: result.public_id,
      usuario_id: req.auth._id,
    });
    // Salva o novo post no bd
    await post.save();
    // Remove o arquivo temporário do sistema de arquivos
    fs.unlinkSync(path);
    // Retorna uma resposta de sucesso
    res.status(200).json({ message: "Post criado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar post" });
  }
};

// Listar todos posts
const listarPostsController = async (req, res) => {
  try {
    // Busca todos os posts no banco de dados, populando os dados do usuário que criou cada post
    const posts = await postModel
      .find()
      .populate("usuario_id", "_id nomeUsuario imagemPerfil")
      .sort({ createdAt: -1 });
    // Retorna uma resposta de sucesso
    res.status(200).send({
      success: true,
      message: "Posts listados com sucesso",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erro ao buscar os posts",
      error,
    });
  }
};

// Listar posts do usuario
const listarMeusPostsController = async (req, res) => {
  try {
    // Busca os posts do usuário autenticado, populando os dados do usuário que criou cada post
    const usuarioPosts = await postModel
      .find({ usuario_id: req.auth._id })
      .populate("usuario_id", "_id nomeUsuario imagemPerfil")
      .sort({ createdAt: -1 });

    // Retorna uma resposta de sucesso
    res.status(200).send({
      success: true,
      message: "Posts listados com sucesso",
      usuarioPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Erro ao buscar os posts",
    });
  }
};

// Atualizar Post
const atualizarPostController = async (req, res) => {
  try {
    // Encontrar o post pelo ID fornecido na URL
    let post = await postModel.findById(req.params.id).exec();

    // Deletar a imagem anterior do Cloudinary
    await cloudinary.uploader.destroy(post.cloudinary_id);

    let result;
    // Se uma nova imagem for enviada na requisição, fazer upload para o Cloudinary
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    // Definir os dados atualizados do post
    const data = {
      nomeReceita: req.body.nomeReceita || post.nomeReceita,
      descricaoReceita: req.body.descricaoReceita || post.descricaoReceita,
      ingredientes: req.body.ingredientes || post.ingredientes,
      passosPreparo: req.body.passosPreparo || post.passosPreparo,
      imagemReceita: result?.secure_url || post.imagemReceita,
      cloudinary_id: result?.public_id || post.cloudinary_id,
    };

    post = await postModel.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    // Se uma nova imagem foi enviada, remover o arquivo temporário do sistema de arquivos
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    // Retorna uma resposta de sucesso
    res.status(200).json({ message: "Post atualizado com sucesso", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocorreu um erro ao atualizar o post" });
  }
};

// Deletar um Post
const deletarPostController = async (req, res) => {
  try {
    // Encontrar o post pelo ID fornecido na URL
    const { id } = req.params;
    const post = await postModel.findById(id);

    // Deletar a imagem do Cloudinary associada ao post
    await cloudinary.uploader.destroy(post.cloudinary_id);

    // Deletar o post do bd
    await postModel.findByIdAndDelete({ _id: id });
    // Retorna uma resposta de sucesso
    res.status(200).send({
      success: true,
      message: "Post deletado com sucesso",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erro ao deletar o post",
    });
  }
};

// Buscar post por nome da receita
const buscarPorNomeController = async (req, res) => {
  try {
    const { nomeReceita } = req.params;

    // Buscar posts cujo nome da receita contenha a string fornecida
    const posts = await postModel
      .find({ nomeReceita: { $regex: new RegExp(nomeReceita, "i") } })
      .populate("usuario_id", "_id nomeUsuario imagemPerfil")
      .sort({ createdAt: -1 });

    // Responder com os posts encontrados
    res.status(200).send({
      success: true,
      message: "Posts listados com sucesso",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erro ao buscar os posts",
      error,
    });
  }
};


// Curtir um post
const likePostController = async (req, res) => {
  try {
    // Obtém o ID do post da URL e o ID do usuário logado
    const { postId } = req.params;
    const usuarioId = req.auth._id;
    // Verificar se o usuário já curtiu o post
    const existingLike = await likeModel.findOne({
      post: postId,
      usuario: usuarioId,
    });
    // Se o usuário já curtiu, retornar uma mensagem indicando que já curtiu
    if (existingLike) {
      return res.status(400).json({ message: "Você já curtiu este post" });
    }
    //Se o usuário ainda não curtiu, criar uma nova curtida
    const newLike = new likeModel({
      post: postId,
      usuario: usuarioId,
    });
    // Salvar a nova curtida no bd
    await newLike.save();
    // Retorna uma resposta de sucesso
    res.status(200).json({ message: "Post curtido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verificar se o usuário curtiu um post
const checkLikeController = async (req, res) => {
  try {
    // Obtém o ID do post da URL e o ID do usuário logado
    const { postId } = req.params;
    const usuarioId = req.auth._id;

    // Verificar se o usuário curtiu o post
    const existingLike = await likeModel.findOne({
      post: postId,
      usuario: usuarioId,
    });

    // Responder com um objeto indicando se o usuário curtiu ou não o post
    const liked = !!existingLike; // Converte o resultado para um booleano

    // Retorna uma resposta de sucesso
    res.status(200).json({ liked });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Contar as curtidas de um post
const quantidadeLikesController = async (req, res) => {
  try {
    // Obtém o ID do post da URL
    const { postId } = req.params;

    // Conta o número de documentos (likes) relacionados ao post
    const likesCount = await likeModel.countDocuments({ post: postId });

    // Responder com o número de curtidas
    res.status(200).json({ likesCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Descurtir um post
const dislikePostController = async (req, res) => {
  try {
    // Obtém o ID do post da URL e o ID do usuário autenticado
    const { postId } = req.params;
    const usuarioId = req.auth._id;

    // Deletar a curtida do usuário no post especificado
    await likeModel.findOneAndDelete({ post: postId, usuario: usuarioId });

    // Responder com uma mensagem de sucesso
    res.status(200).json({ message: "Post disliked" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  novoPostController,
  listarPostsController,
  listarMeusPostsController,
  deletarPostController,
  atualizarPostController,
  buscarPorNomeController,
  likePostController,
  dislikePostController,
  quantidadeLikesController,
  checkLikeController
};
