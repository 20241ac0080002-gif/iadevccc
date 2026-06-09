const mongoose = require('mongoose');

const MensagemSchema = new mongoose.Schema({
    role: String, // 'user' (usuário) ou 'model' (IA)
    parts: [{ text: String }], // O conteúdo da mensagem
    dataHora: { type: Date, default: Date.now } // Hora exata
});

module.exports = mongoose.model('Mensagem', MensagemSchema);