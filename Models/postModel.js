const mongoose = require("mongoose");
const likeModel = require("./likeModel");
const comentarioModel = require("./comentarioModel");
const postSchema = new mongoose.Schema(
  {
    imagemReceita: {
      type: String, // A imagem da receita será armazenada como uma URL
      required: [true, "Por favor, adicione a URL da imagem da receita"],
    },

    cloudinary_id: {
      type: String,
    },

    nomeReceita: {
      type: String,
      required: [true, "Por favor, adicione o nome da receita"],
    },

    descricaoReceita: {
      type: String,
      required: [true, "Por favor, adicione uma descrição para a receita"],
    },

    ingredientes: {
      type: [String],
      required: [true, "Por favor, adicione os ingredientes da receita"],
    },

    passosPreparo: {
      type: [String],
      required: [true, "Por favor, adicione o modo de preparo da receita"],
    },

    donoPost: {
      type: mongoose.Schema.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },

  { timestamps: true }
);

postSchema.pre("remove", async function (next) {
  try {
    // Excluir todos os likes do post
    await likeModel.deleteMany({ post: this._id });
    // Excluir todos os comentários do post
    await comentarioModel.deleteMany({ post: this._id });
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model("Post", postSchema);