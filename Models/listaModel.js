const mongoose = require("mongoose");

const listaSchema = new mongoose.Schema(
  {
    quantidade: {
      type: Number,
      required: true
    },

    unidadeMedida: {
      type: String,
      enum: ["unidade(s)", "grama(s)", "quilo(s)", "mililitro(s)", "litro(s)", "duzia(s)", "caixa(s)"],
      required: true
    },

    nomeItem: {
      type: String, 
      required: true,
    },

    donoLista: {
      type: mongoose.Schema.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Lista", listaSchema);
