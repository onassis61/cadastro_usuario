const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Importar para lidar com caminhos

// Criar a aplicação Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conectar ao banco de dados MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root', // Alterar para o seu usuário do MySQL
    password: 'admin', // Alterar para a senha do seu MySQL
    database: 'cadastro_usuarios'
});

// Verificar se a conexão foi bem-sucedida
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco de dados: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para criar um novo usuário
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;

    // Validações no backend
    if (!nome || nome.length < 15) {
        return res.status(400).json({ error: 'O campo Nome deve ter no mínimo 15 caracteres.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'O campo Email deve ser um email válido.' });
    }

    const query = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)';
    db.query(query, [nome, email], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao cadastrar usuário' });
            return;
        }
        res.status(200).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
    });
});

// Rota para listar os usuários
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao buscar usuários' });
            return;
        }
        res.status(200).json(result);
    });
});

app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;

    // Validações no backend
    if (!nome || nome.length < 15) {
        return res.status(400).json({ error: 'O campo Nome deve ter no mínimo 15 caracteres.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'O campo Email deve ser um email válido.' });
    }

    const query = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';
    db.query(query, [nome, email, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao editar usuário' });
            return;
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    });
});

// Rota para excluir um usuário
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuarios WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao excluir usuário' });
            return;
        }
        res.status(200).json({ message: 'Usuário excluído com sucesso!' });
    });
});

// Rota para servir o frontend (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
