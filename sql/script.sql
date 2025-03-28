-- Active: 1742946282785@@127.0.0.1@3306@ecommerce
CREATE DATABASE ecommerce;

USE ecommerce;

DROP DATABASE ecommerce;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    senha VARCHAR(150) NOT NULL,
    logged_at DATETIME DEFAULT NOW(),
    create_at DATETIME DEFAULT NOW()
);

select * from usuario;

alter table usuario modify column create_at DATETIME DEFAULT NOW();
alter table usuario add column isAdmin BOOLEAN DEFAULT false;

CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL
);

alter table categoria add column descricao TEXT NOT NULL;

CREATE TABLE produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL,
    preco DOUBLE NOT NULL,
    categoria INT NOT NULL,
    descricao TEXT NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    FOREIGN KEY (categoria) REFERENCES categoria(id) ON DELETE CASCADE
);

CREATE TABLE endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rua VARCHAR(100) NOT NULL,
    numero INT NOT NULL,
    bairro VARCHAR(50),
    estado VARCHAR(20),
    pais VARCHAR(30),
    usuario INT NOT NULL,
    FOREIGN KEY (usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

ALTER TABLE endereco
ADD COLUMN activate BOOLEAN DEFAULT true;

DESCRIBE endereco;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT NOT NULL,
    statusOrder VARCHAR(15) NOT NULL,
    usuario INT NOT NULL,
    produto INT NOT NULL,
    FOREIGN KEY (usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (produto) REFERENCES produto(id) ON DELETE CASCADE
);

alter table orders add column create_at DATETIME DEFAULT NOW();
alter table orders modify column statusOrder ENUM('pendente', 'confirmado', 'cancelado', 'entregue');

CREATE TABLE imagem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    produto INT NOT NULL,
    FOREIGN KEY (produto) REFERENCES produto(id) ON DELETE CASCADE
);

ALTER TABLE orders 
ADD COLUMN endereco INT NOT NULL,
ADD FOREIGN KEY (endereco) REFERENCES endereco(id) ON DELETE CASCADE;

