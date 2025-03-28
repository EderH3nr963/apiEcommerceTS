const gerarCodigo = (): string => {
    return Math.random().toString().slice(2, 8); // Exemplo: "123456"
};

export default gerarCodigo;
