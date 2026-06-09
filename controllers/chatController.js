const Mensagem = require('../models/Mensagem');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuração da IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.sendMessage = async (req, res) => {
    try {
        const { pergunta } = req.body;

        if (!pergunta) {
            return res.status(400).json({ erro: "Envie uma 'pergunta' no JSON." });
        }

        console.log(`📩 Pergunta recebida: ${pergunta}`);

        // A) Salva a pergunta do usuário no Banco de Dados
        await Mensagem.create({ role: "user", parts: [{ text: pergunta }] });

        // B) Busca o histórico de conversas no Banco
        const historicoBanco = await Mensagem.find()
                                        .sort({ dataHora: 1 })
                                        .limit(20);

        // =================================================================
        // ✨ A MÁGICA ACONTECE AQUI ✨
        // Limpamos todas as sujeiras e _ids escondidos do MongoDB
        // =================================================================
        const historicoFormatado = historicoBanco.map(msg => ({
            role: msg.role,
            // Pega estritamente o texto, ignorando o _id que o mongo coloca na lista parts
            parts: msg.parts.map(p => ({ text: p.text })) 
        }));

        // C) Inicia o chat do Gemini com o histórico perfeitamente formatado
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const chat = model.startChat({
            history: historicoFormatado 
        });

        // D) Manda a nova pergunta para a IA
        const result = await chat.sendMessage(pergunta);
        const respostaDaIA = result.response.text();

        // E) Salva a resposta da IA no Banco de Dados
        await Mensagem.create({ role: "model", parts: [{ text: respostaDaIA }] });

        // F) Devolve a resposta para o Front-end
        return res.status(200).json({ 
            sucesso: true,
            resposta: respostaDaIA 
        });

    } catch (erro) {
        console.error("❌ Erro:", erro);
        res.status(500).json({ erro: "Amnésia do servidor. Erro na IA ou no Banco de Dados." });
    }
};

exports.limparHistorico = async (req, res) => {
    try {
        await Mensagem.deleteMany({});
        console.log("🧹 Memória apagada com sucesso!");
        return res.status(200).json({ sucesso: true, mensagem: "Memória formatada! A IA esqueceu tudo." });
    } catch (erro) {
        console.error("❌ Erro ao apagar memória:", erro);
        res.status(500).json({ erro: "Não foi possível apagar a memória." });
    }
};