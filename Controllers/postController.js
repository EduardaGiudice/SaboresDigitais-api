const cloudinary = require("../Config/cloudinary");
const postModel = require("../Models/postModel");
const usuarioModel = require("../Models/usuarioModel")
const Post = require("../Routes/postRoutes");
const likeModel = require("../Models/likeModel");


const fs = require("fs");

// Novo post
const novoPostController = async (req, res) => {
  try {
    const { path } = req.file;
    const result = await cloudinary.uploader.upload(path);
    const post = new postModel({
      nomeReceita: req.body.nomeReceita,
      descricaoReceita: req.body.descricaoReceita,
      ingredientes: req.body.ingredientes,
      passosPreparo: req.body.passosPreparo,
      imagemReceita: result.secure_url,
      cloudinary_id: result.public_id,
      donoPost: req.auth._id,
    });
    await post.save();
    fs.unlinkSync(path);
    res.status(200).json({ message: "Post criado com sucesso" }); // Mensagem de sucesso
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar post" }); // Se ocorrer um erro
  }
};

// Listar todos posts
const listarPostsController = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("donoPost", "_id nomeUsuario imagemPerfil")
      .sort({ createdAt: -1 });
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
    const usuarioPosts = await postModel
      .find({ donoPost: req.auth._id })
      .populate("donoPost", "_id nomeUsuario imagemPerfil")
      .sort({ createdAt: -1 });

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
    let post = await postModel.findById(req.params.id).exec();

    //deletar a imagem do cloudinary
    await cloudinary.uploader.destroy(post.cloudinary_id);

    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path)
    }
    const data = {
      nomeReceita: req.body.nomeReceita || post.nomeReceita,
      descricaoReceita: req.body.descricaoReceita || post.descricaoReceita,
      ingredientes: req.body.ingredientes || post.ingredientes,
      passosPreparo: req.body.passosPreparo || post.passosPreparo,
      imagemReceita: result?.secure_url || post.imagemReceita,
      cloudinary_id: result?.public_id || post.cloudinary_id,
    };

    post = await postModel.findByIdAndUpdate(req.params.id, data, {new:true})
  if(req.file){
    fs.unlinkSync(req.file.path)
  }
  res.status(200).json({ message: "Post atualizado com sucesso", post });
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    res.status(500).json({ message: "Ocorreu um erro ao atualizar o post" });
  }
};

// Deletar Post
const deletarPostController = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    //deletar a imagem do cloudinary
    await cloudinary.uploader.destroy(post.cloudinary_id);

    await postModel.findByIdAndDelete({ _id: id });
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

// Buscar post por nomeReceita
const buscarPorNomeController = async (req, res) => {
  try {
    const { nomeReceita } = req.params;

    const posts = await postModel
      .find({ nomeReceita: { $regex: new RegExp(nomeReceita, "i") } })
      .populate("donoPost", "_id nomeUsuario imagemPerfil")
      .sort({ createdAt: -1 });

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

const likePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const usuarioId = req.auth._id;

    // Verifique se o usuário já curtiu o post
    const existingLike = await likeModel.findOne({ post: postId, usuario: usuarioId });

    // Se o usuário já curtiu, retorne uma mensagem indicando que já curtiu
    if (existingLike) {
      return res.status(400).json({ message: "Você já curtiu este post" });
    }

    // Se o usuário ainda não curtiu, crie uma nova curtida
    const newLike = new likeModel({
      post: postId,
      usuario: usuarioId,
    });

    await newLike.save();

    res.status(200).json({ message: "Post curtido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkLikeController = async (req, res) => {
  try {
    const { postId } = req.params;
    const usuarioId = req.auth._id;

    const existingLike = await likeModel.findOne({ post: postId, usuario: usuarioId });
    const liked = !!existingLike;

    res.status(200).json({ liked });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Contar as curtidas de um post
const quantidadeLikesController = async (req, res) => {
  try {
    const { postId } = req.params;

    const likesCount = await likeModel.countDocuments({ post: postId });

    res.status(200).json({ likesCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Descurtir um post
const dislikePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const usuarioId = req.auth._id;

    await likeModel.findOneAndDelete({ post: postId, usuario: usuarioId });

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
