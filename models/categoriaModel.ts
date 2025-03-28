import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Categoria extends RowDataPacket {
    id?: number;
    nome: string;
    descricao: string;
}

interface CategoriaUpdate extends Partial<Omit<Categoria, 'id'>> {}

const SQL_QUERIES = {
    FIND_ALL: 'SELECT * FROM categoria',
    FIND_BY_ID: 'SELECT * FROM categoria WHERE id = ?',
    CREATE: 'INSERT INTO categoria (nome, descricao) VALUES (?, ?)',
    UPDATE: 'UPDATE categoria SET nome = ?, descricao = ? WHERE id = ?',
    DELETE: 'DELETE FROM categoria WHERE id = ?',
    FIND_BY_CAMPO: 'SELECT * FROM categoria WHERE ? = ?'
} as const;

class CategoriaModel {
    static async getAll(): Promise<Categoria[]> {
        try {
            const [rows] = await pool.execute<Categoria[]>(SQL_QUERIES.FIND_ALL);
            return rows;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar todas as categorias:', error);
            throw new Error('Erro ao buscar todas as categorias');
        }
    }
    
    static async getById(id: number): Promise<Categoria | null> {
        try {
            const [rows] = await pool.execute<Categoria[]>(SQL_QUERIES.FIND_BY_ID, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar categoria por ID:', error);
            throw new Error('Erro ao buscar categoria por ID');
        }
    }
    
    static async getByCampo(campo: string, valor: string): Promise<Categoria | null> {
        try {
            const [rows] = await pool.execute<Categoria[]>(SQL_QUERIES.FIND_BY_CAMPO, [campo, valor]);
            return rows[0] || null;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar categoria por campo:', error);
            throw new Error('Erro ao buscar categoria por campo');
        }
    }

    static async create(categoria: Categoria): Promise<boolean> {
        try {
            const categoriaExistente = await this.getByCampo('nome', categoria.nome);

            if (categoriaExistente) {
                return false;
            }

            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.CREATE, [categoria.nome, categoria.descricao]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao criar categoria:', error);
            throw new Error('Erro ao criar categoria');
        }
    }

    static async update(id: number, categoria: CategoriaUpdate): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE, [categoria.nome, categoria.descricao, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar categoria:', error);
            throw new Error('Erro ao atualizar categoria');
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.DELETE, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao deletar categoria:', error);
            throw new Error('Erro ao deletar categoria');
        }
    }
}

export default CategoriaModel;

