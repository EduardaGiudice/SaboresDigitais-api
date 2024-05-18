const mongoose = require("mongoose");

const listaSchema = new mongoose.Schema(
  {
    quantidade: {
      type: Number,
      required: true
    },

    unidadeMedida: {
      type: String,
      enum: ["unidade(s)", "grama(s)", "quilo(s)", "mililitro(s)", "litro(s)", "dúzia(s)", "caixa(s)"],
      required: true
    },

    nomeItem: {
      type: String, 
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

module.exports = mongoose.model("Lista", listaSchema);
