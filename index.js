require('dotenv').config();
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require('cors');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conectado ao banco de dados");
    connection.release();
});

app.use(express.json());
app.use(cors());

app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
        if (err) {
            res.send(err);
        } else if (result.length == 0) {
            db.query("INSERT INTO usuarios (email, password) values (?, ?)", [email, password], (err, response) => {
                if (err) {
                    res.send(err);
                    alert('Erro cadatrado {backend}')
                } else {
                    res.send({ msg: "Cadastrado com sucesso" });
                }
            });
        } else {
            res.send({ msg: "Usuário já cadastrado" });
        }
    });
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM usuarios WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (err) {
            res.send(err);
        }
        if (result.length > 0) {
            res.send({ msg: "Usuário logado com sucesso" });
        } else {
            res.send({ msg: "Conta não encontrada, tente novamente." });
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});