import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Interface que define a estrutura de um endereço no banco de dados
export interface Endereco extends RowDataPacket {
    id?: number;         // ID único do endereço (opcional para criação)
    rua: string;        // Nome da rua
    numero: number;     // Número do endereço
    bairro: string;     // Nome do bairro
    estado: string;     // Nome do estado
    pais: string;       // Nome do país
    usuario: number;    // ID do usuário associado
}

// Interface para atualização de endereço
interface EnderecoUpdate extends Partial<Omit<Endereco, 'id' | 'usuario'>> {}

// Queries SQL
const SQL_QUERIES = {
    FIND_BY_USER: 'SELECT * FROM endereco WHERE usuario = ?',
    FIND_BY_ID: 'SELECT * FROM endereco WHERE id = ?',
    CREATE: 'INSERT INTO endereco (rua, numero, bairro, estado, pais, usuario) VALUES (?, ?, ?, ?, ?, ?)',
    UPDATE: 'UPDATE endereco SET rua = ?, numero = ?, bairro = ?, estado = ?, pais = ? WHERE id = ?',
    DELETE: 'DELETE FROM endereco WHERE id = ?'
} as const;

class EnderecoModel {
    /**
     * Busca todos os endereços de um usuário
     * @param idUsuario ID do usuário
     * @returns Array de endereços ou array vazio se não encontrado
     * @throws Error se ocorrer erro na consulta
     */
    static async getAllByIdUsuario(idUsuario: number): Promise<Endereco[]> {
        try {
            const [rows] = await pool.execute<Endereco[]>(SQL_QUERIES.FIND_BY_USER, [idUsuario]);
            return rows;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar endereços do usuário:', error);
            throw new Error('Erro ao buscar endereços do usuário');
        }
    }

    /**
     * Busca um endereço pelo ID
     * @param id ID do endereço
     * @returns Endereco ou null se não encontrado
     * @throws Error se ocorrer erro na consulta
     */
    static async getById(id: number): Promise<Endereco | null> {
        try {
            const [rows] = await pool.execute<Endereco[]>(SQL_QUERIES.FIND_BY_ID, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar endereço por ID:', error);
            throw new Error('Erro ao buscar endereço por ID');
        }
    }

    /**
     * Cria um novo endereço
     * @param endereco Dados do endereço a ser criado
     * @returns true se criado com sucesso, false caso contrário
     * @throws Error se ocorrer erro na criação
     */
    static async create(endereco: Endereco): Promise<boolean> {
        try {
            const values = [
                endereco.rua,
                endereco.numero,
                endereco.bairro,
                endereco.estado,
                endereco.pais,
                endereco.usuario
            ];

            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.CREATE, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao criar endereço:', error);
            throw new Error('Erro ao criar endereço');
        }
    }

    /**
     * Atualiza um endereço existente
     * @param id ID do endereço
     * @param endereco Dados a serem atualizados
     * @returns true se atualizado com sucesso, false caso contrário
     * @throws Error se ocorrer erro na atualização
     */
    static async update(id: number, endereco: EnderecoUpdate): Promise<boolean> {
        try {
            const values = [
                endereco.rua,
                endereco.numero,
                endereco.bairro,
                endereco.estado,
                endereco.pais,
                id
            ];

            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar endereço:', error);
            throw new Error('Erro ao atualizar endereço');
        }
    }

    /**
     * Remove um endereço
     * @param id ID do endereço a ser removido
     * @returns true se removido com sucesso, false caso contrário
     * @throws Error se ocorrer erro na remoção
     */
    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.DELETE, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao deletar endereço:', error);
            throw new Error('Erro ao deletar endereço');
        }
    }
}

export default EnderecoModel;