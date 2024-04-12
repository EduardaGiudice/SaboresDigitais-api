const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema(
  {
    comentario: {
      type: String,
      required: [true, "Por favor, adicione o comentario"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comentario", comentarioSchema);
