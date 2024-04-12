const mongoose = require("mongoose");

const listaSchema = new mongoose.Schema(
  {
    quantidade: {
      type: Number,
      required: [true, "Por favor, adicione a quantidade"],
    },

    unidadeMedida: {
      type: String,
      enum: ["unidade(s)", "grama(s)", "quilo(s)", "mililitro(s)", "litro(s)", "dúzia(s)", "caixa(s)"],
      required: [true, "Por favor, adicione a unidade de medida"],
    },

    nomeItem: {
      type: String, 
      required: [true, "Por favor, adicione o produto"],
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
