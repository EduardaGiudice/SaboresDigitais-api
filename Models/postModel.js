const mongoose = require("mongoose");
const likeModel = require("./likeModel");
const comentarioModel = require("./comentarioModel");
const postSchema = new mongoose.Schema(
  {
    imagemReceita: {
      type: String,
      required: true
    },

    cloudinary_id: {
      type: String,
    },

    nomeReceita: {
      type: String,
      required: true,
    },

    descricaoReceita: {
      type: String,
      required: true,
    },

    ingredientes: {
      type: [String],
      required: true,
    },

    passosPreparo: {
      type: [String],
      required: true,
    },

    usuario_id: {
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
