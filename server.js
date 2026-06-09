require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Importação das rotas modulares
const chatRoutes = require('./routes/chatRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Conectado ao MongoDB Atlas com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar no banco:', err));

// Rota de Status - Teste no Navegador
app.get('/api/status', (req, res) => {
    res.json({ status: "Servidor Online e com Memória de Elefante! 🐘🚀" });
});

// A Rota Principal agora usa a pasta Routes!
app.use('/api/chat', chatRoutes);

// Ligar o Servidor
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`✅ Servidor rodando na porta ${PORTA}`);
});