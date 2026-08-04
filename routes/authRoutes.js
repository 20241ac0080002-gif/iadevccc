const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Cadastro
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) return res.status(400).json({ erro: "E-mail já cadastrado" });

        const novoUsuario = new Usuario({ nome, email, senha });
        await novoUsuario.save();
        res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao cadastrar" });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(401).json({ erro: "Credenciais inválidas" });

        const senhaOk = await bcrypt.compare(senha, usuario.senha);
        if (!senhaOk) return res.status(401).json({ erro: "Credenciais inválidas" });

        const token = jwt.sign(
            { id: usuario._id, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, nome: usuario.nome });
    } catch (err) {
        res.status(500).json({ erro: "Erro no login" });
    }
});

module.exports = router;