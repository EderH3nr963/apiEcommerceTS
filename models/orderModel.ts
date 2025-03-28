import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface Order extends RowDataPacket {
    id?: number;
    quantidade: number,
    usuario: number,
    produto: number,
    endereco: number,
    statusOrder: string;
    create_at: Date;
}

export interface OrderCreate extends Omit<Order, 'id'> {}

const SQL_QUERIES = {
    CREATE: "INSERT INTO order(quantidade, usuario, produto, endereco, statusOrder) VALUES(?, ?, ?, ?, ?)",
    GET_ALL_BY_USER: "SELECT * FROM order WHERE usuario = ?",
    GET_ALL_BY_PRODUTO: "SELECT * FROM order WHERE produto = ?",
    UPDATE_STATUS: "UPDATE order SET statusOrder = ? WHERE id = ?",
    UPDATE_ENDERECO: "UPDATE order SET endereco = ? WHERE id = ?",
}

class OrderModel {
    static async create(order: OrderCreate): Promise<boolean> {
        try {
            const response = await pool.execute<ResultSetHeader>(SQL_QUERIES.CREATE, [order.quantidade, order.usuario, order.produto, order.endereco, order.statusOrder]);

            return response[0].affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao criar pedido:', error);
            throw new Error('Erro ao criar pedido');
        }
    }

    static async getAllByUser(usuario: number): Promise<Order[]> {
        try {
            const response = await pool.execute<Order[]>(SQL_QUERIES.GET_ALL_BY_USER, [usuario]);

            return response[0];
        } catch (error) {
            console.error('[Database Error] Erro ao buscar pedidos do usuário:', error);
            throw new Error('Erro ao buscar pedidos do usuário');
        }
    }

    static async getAllByProduto(produto: number): Promise<Order[]> {
        try {
            const response = await pool.execute<Order[]>(SQL_QUERIES.GET_ALL_BY_PRODUTO, [produto]);

            return response[0];
        } catch (error) {
            console.error('[Database Error] Erro ao buscar pedidos do produto:', error);
            throw new Error('Erro ao buscar pedidos do produto');
        }
    }

    static async updateStatus(id: number, statusOrder: string): Promise<boolean> {
        try {
            const response = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE_STATUS, [statusOrder, id]);

            return response[0].affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar pedido:', error);
            throw new Error('Erro ao atualizar pedido');
        }
    }
    
    static async updateEndereco(id: number, endereco: number): Promise<boolean> {
        try {
            const response = await pool.execute<ResultSetHeader>(SQL_QUERIES.UPDATE_ENDERECO, [endereco, id]);

            return response[0].affectedRows > 0;
        } catch (error) {
            console.error('[Database Error] Erro ao atualizar endereço do pedido:', error);
            throw new Error('Erro ao atualizar endereço do pedido');
        }
    }
}


export default OrderModel;