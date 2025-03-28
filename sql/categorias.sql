CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    imagem VARCHAR(255),
    categoria_pai INT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_pai) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Inserir algumas categorias iniciais
INSERT INTO categorias (nome, descricao) VALUES
('Eletrônicos', 'Produtos eletrônicos em geral'),
('Roupas', 'Vestuário para todas as idades'),
('Casa', 'Produtos para casa e decoração'),
('Esportes', 'Equipamentos e acessórios esportivos'),
('Livros', 'Livros e materiais de leitura'); 