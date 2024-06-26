
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const conectarDB = require("./Config/db");

dotenv.config();

//Conexão MongoDB
conectarDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Rotas
app.use("/auth", require("./Routes/usuarioRoutes"));
app.use("/post", require("./Routes/postRoutes"));
app.use("/lista", require("./Routes/listaRoutes"));
app.use("/comentarios", require("./Routes/comentarioRoutes"));


app.get("/", (req, res) => {
  res.status(200).send({
    'success': true,
    'msg': "Node Server Running",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`.white);
});
