const mongoose = require('mongoose')
const colors = require('colors')

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Conectado ao Banco de dados ${mongoose.connection.host}`)
    }catch (error) {
        console.log(`erro ao conectar ao banco de dados ${error}`.bgRed.white)
    }
}

module.exports = conectarDB;