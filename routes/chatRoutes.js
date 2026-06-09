const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Rota para enviar a pergunta (POST)
router.post('/', chatController.sendMessage);

// Rota para limpar a memória (DELETE)
router.delete('/limpar', chatController.limparHistorico);

// Exporta as rotas para o server.js poder usar
module.exports = router;