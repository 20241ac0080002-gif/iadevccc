// 1. Importações
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 2. Configurações
const app = express();
app.use(express.json());
app.use(cors());

// 3. Configuração da IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rota de Status (Desafio Extra) - Teste no Navegador
app.get('/api/status', (req, res) => {
    res.json({ status: "Servidor Online! 🚀" });
});

// 4. Rota do Chat (POST) - Teste no Insomnia
app.post('/api/chat', async (req, res) => {
    try {

        if (!req.body) {
            return res.status(400).json({ erro: "Envie um JSON no corpo da requisição." });
        }

        const { pergunta } = req.body;

        if (!pergunta) {
            return res.status(400).json({ erro: "Envie uma 'pergunta' no JSON." });
        }

        console.log(`📩 Pergunta: ${pergunta}`);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const promptFinal = `Você é um robô sarcástico. Responda: ${pergunta}`;
        
        const result = await model.generateContent(promptFinal);
        const respostaDaIA = result.response.text();

        return res.status(200).json({ 
            sucesso: true,
            resposta: respostaDaIA 
        });

    } catch (erro) {
        console.error("❌ Erro:", erro);
        res.status(500).json({ erro: "Erro na IA." });
    }
});

// 5. Ligar o Servidor
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORTA}`);
});