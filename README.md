Para rodar comece usando o comando npm init -y no terminal, assim a pasta node_modules será instalada.

no mysql crie um banco de dados chamado cadastro_usuarios;

na query rode o seguinte;

CREATE DATABASE cadastro_usuarios;

USE cadastro_usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

