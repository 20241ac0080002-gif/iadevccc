require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 1. IMPORTAÇÃO DAS ROTAS E MIDDLEWARE
const authRoutes = require('./routes/authRoutes'); // Novas rotas de Login/Registro
const chatRoutes = require('./routes/chatRoutes'); // Rotas do Chat da Sprint anterior
const autenticarToken = require('./routes/authMiddleware'); // O "Segurança"

const app = express();

// 2. CONFIGURAÇÕES INICIAIS
app.use(express.json());
app.use(cors());

// 3. CONEXÃO COM O MONGODB ATLAS
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Conectado ao MongoDB Atlas com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar no banco:', err));

// 4. ROTAS PÚBLICAS (Qualquer um acessa - Sem Token)
app.get('/api/status', (req, res) => {
    res.json({ status: "Servidor Online e Seguro! 🔐🚀" });
});

// Rota de Autenticação (Aqui o usuário se cadastra e recebe o "Crachá" JWT)
app.use('/api/auth', authRoutes);


// 5. ROTAS PROTEGIDAS (Somente com Token JWT válido)
// Note que passamos 'autenticarToken' antes das rotas de chat.
// Se o token for inválido, o código nem chega a entrar no chatRoutes.
app.use('/api/chat', autenticarToken, chatRoutes);


// 6. LIGAR O SERVIDOR
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`✅ Servidor rodando na porta ${PORTA}`);
    console.log(`🔒 Segurança JWT Ativada.`);
});