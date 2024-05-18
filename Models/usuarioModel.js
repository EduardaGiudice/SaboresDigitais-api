const mongoose = require ('mongoose');
const postModel = require('./postModel');
const listaModel = require('./listaModel');

const usuarioSchema = new mongoose.Schema(
  {
    nomeUsuario: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    senha: {
      type: String,
      required: true,
      min: 6,
      max: 50,
    },

    imagemPerfil: {
      type: String,
      default:
        "https://res.cloudinary.com/dqeippn06/image/upload/v1711932923/avatar_xgprnj.jpg",
    },

    cloudinary_id: {
      type: String,
      default: "v1711932923",
    },
  },
  { timestamps: true }
);

usuarioSchema.pre("remove", async function (next) {
  try {
    // Excluir todos os posts do usuário
    await postModel.deleteMany({ donoPost: this._id });
    // Excluir todas as listas do usuário
    await listaModel.deleteMany({ donoLista: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema)