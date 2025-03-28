import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';

// Interface que define a estrutura de um usuário no banco de dados
export interface Usuario extends RowDataPacket {
    id: number;          // ID único do usuário
    username: string;    // Nome de usuário
    email: string;       // Email do usuário
    telefone: string;    // Telefone do usuário
    senha: string;       // Senha hasheada do usuário
    create_at: Date;     // Data de criação do usuário
    logged_at: Date;     // Data do último login
}

// Interface para criação de usuário, omitindo campos gerados automaticamente
interface UsuarioCreate extends Omit<Usuario, 'id' | 'create_at' | 'logged_at'> {}

// Interface para atualização de usuário
interface UsuarioUpdate {
    username?: string;
    email?: string;
    telefone?: string;
}

// Queries SQL
const SQL_QUERIES = {
    FIND_BY_EMAIL: 'SELECT * FROM usuario WHERE email = ?',
    FIND_BY_ID: 'SELECT * FROM usuario WHERE id = ?',
    FIND_ALL: 'SELECT * FROM usuario',
    CREATE: 'INSERT INTO usuario (username, email, telefone, senha) VALUES (?, ?, ?, ?)',
    UPDATE_LOGGED_AT: 'UPDATE usuario SET logged_at = NOW() WHERE id = ?',
    UPDATE_USER: 'UPDATE usuario SET username = ?, email = ?, telefone = ? WHERE id = ?',
    UPDATE_PASSWORD: 'UPDATE usuario SET senha = ? WHERE id = ?',
    UPDATE_NAME: 'UPDATE usuario SET username = ? WHERE id = ?'
} as const;

class UsuarioModel {
    private static readonly SALT_ROUNDS = 10;

    /**
     * Busca um usuário pelo email
     * @param email Email do usuário
     * @returns Usuario ou null se não encontrado
     * @throws Error se ocorrer erro na consulta
     */
    static async findByEmail(email: string): Promise<Usuario | null> {
        try {
            const [rows] = await pool.execute<Usuario[]>(SQL_QUERIES.FIND_BY_EMAIL, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar usuário por email:', error);
            throw new Error('Erro ao buscar usuário por email');
        }
    }

    /**
     * Cria um novo usuário no banco de dados
     * @param usuario Dados do usuário a ser criado
     * @returns true se criado com sucesso, false caso contrário
     * @throws Error se ocorrer erro na criação
     */
    static async create(usuario: UsuarioCreate): Promise<boolean> {
        try {
            const senhaHash = await bcrypt.hash(usuario.senha, this.SALT_ROUNDS);
            const { senha, ...dadosUsuario } = usuario;
            
            const values = [
                dadosUsuario.username,
                dadosUsuario.email,
                dadosUsuario.telefone,
                senhaHash
            ];

            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.CREATE, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao criar usuário:', error);
            throw new Error('Erro ao criar usuário');
        }
    }

    /**
     * Compara a senha fornecida com a senha hasheada
     * @param senha Senha fornecida
     * @param hashedSenha Senha hasheada armazenada
     * @returns true se as senhas coincidem, false caso contrário
     */
    static async comparePassword(senha: string, hashedSenha: string): Promise<boolean> {
        try {
            return await bcrypt.compare(senha, hashedSenha);
        } catch (error) {
            console.error('[Auth Error] Erro ao comparar senhas:', error);
            return false;
        }
    }

    /**
     * Busca um usuário pelo ID
     * @param id ID do usuário
     * @returns Usuario ou null se não encontrado
     * @throws Error se ocorrer erro na consulta
     */
    static async findById(id: number): Promise<Usuario | null> {
        try {
            const [rows] = await pool.execute<Usuario[]>(SQL_QUERIES.FIND_BY_ID, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('[Database Error] Erro ao buscar usuário por ID:', error);
            throw new Error('Erro ao buscar usuário por ID');
        }
    }

    /**
     * Lista todos os usuários
     * @returns Array de usuários ou null se ocorrer erro
     * @throws Error se ocorrer erro na consulta
     */
    static async findAll(): Promise<Usuario[]> {
        try {
            const [rows] = await pool.execute<Usuario[]>(SQL_QUERIES.FIND_ALL);
            return rows;
        } catch (error) {
            console.error('[Database Error] Erro ao listar usuários:', error);
            throw new Error('Erro ao listar usuários');
        }
    }

    /**
     * Atualiza a data do último login do usuário
     * @param id ID do usuário
     * @returns true se atualizado com sucesso, false caso contrário
     * @throws Error se ocorrer erro na atualização
     */
    static async updateLoggedAt(id: number): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE_LOGGED_AT, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar data de login:', error);
            throw new Error('Erro ao atualizar data de login');
        }
    }

    /**
     * Atualiza os dados do usuário
     * @param id ID do usuário
     * @param usuario Dados a serem atualizados
     * @returns true se atualizado com sucesso, false caso contrário
     * @throws Error se ocorrer erro na atualização
     */
    static async update(id: number, usuario: UsuarioUpdate): Promise<boolean> {
        try {
            const values = [
                usuario.username,
                usuario.email,
                usuario.telefone,
                id
            ];

            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE_USER, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar usuário:', error);
            throw new Error('Erro ao atualizar usuário');
        }
    }

    /**
     * Atualiza a senha do usuário
     * @param id ID do usuário
     * @param senha Nova senha
     * @returns true se atualizado com sucesso, false caso contrário
     * @throws Error se ocorrer erro na atualização
     */
    static async updatePassword(id: number, senha: string): Promise<boolean> {
        try {
            const hashedSenha = await bcrypt.hash(senha, this.SALT_ROUNDS);
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE_PASSWORD, [hashedSenha, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar senha:', error);
            throw new Error('Erro ao atualizar senha');
        }
    }

    /**
     * Atualiza o nome do usuário
     * @param id ID do usuário
     * @param username Novo nome de usuário
     * @returns true se atualizado com sucesso, false caso contrário
     * @throws Error se ocorrer erro na atualização
     */
    static async updateName(id: number, username: string): Promise<boolean> {
        try {
            const [result] = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE_NAME, [username, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar nome:', error);
            throw new Error('Erro ao atualizar nome');
        }
    }
}

export default UsuarioModel;