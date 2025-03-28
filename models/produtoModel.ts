import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface Produto extends RowDataPacket {
    id?: number;
    nome: string;
    preco: number;
    categoria: number;
    descricao: string;
    estoque: number;
}

export interface ProdutoUpdate extends Partial<Omit<Produto, 'id' >> {}

// Queries SQL
const SQL_QUERIES = {
    FIND_ALL: 'SELECT * FROM produto',
    FIND_BY_ID: 'SELECT * FROM produto WHERE id = ?',
    CREATE: 'INSERT INTO produto (nome, preco, categoria, descricao, estoque) VALUES (?, ?, ?, ?, ?)',
    UPDATE: 'UPDATE produto SET nome = ?, preco = ?, descricao = ?, estoque = ?, categoria = ? WHERE id = ?',
    DELETE: 'DELETE FROM produto WHERE id = ?',
    FIND_BY_CAMPO: 'SELECT * FROM produto WHERE ? = ?'
} as const;

class ProdutoModel {
    static async getAll(): Promise<Produto[]> {
        try {
            const [rows] = await pool.execute<Produto[]>(SQL_QUERIES.FIND_ALL);
            return rows;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar todos os produtos:', error);
            throw new Error('Erro ao buscar todos os produtos');
        }
    }

    static async getById(id: number): Promise<Produto | null> {
        try {
            const [rows] = await pool.execute<Produto[]>(SQL_QUERIES.FIND_BY_ID, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar produto por ID:', error);
            throw new Error('Erro ao buscar produto por ID');
        }
    }

    static async create(produto: Produto): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.CREATE, [produto.nome, produto.preco, produto.categoria, produto.descricao, produto.estoque]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao criar produto:', error);
            throw new Error('Erro ao criar produto');
        }
    }

    static async update(id: number, produto: ProdutoUpdate): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE, [produto.nome, produto.preco, produto.descricao, produto.estoque, produto.categoria, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar produto:', error);
            throw new Error('Erro ao atualizar produto');
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.DELETE, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao deletar produto:', error);
            throw new Error('Erro ao deletar produto');
        }
    }

    static async getByCategoria(categoria: number): Promise<Produto[] | null> {
        try {
            const [rows] = await pool.execute<Produto[]>(SQL_QUERIES.FIND_BY_CAMPO, ['categoria', categoria]);
            return rows || null;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar produtos por categoria:', error);
            throw new Error('Erro ao buscar produtos por categoria');
        }
    }
}

export default ProdutoModel;
