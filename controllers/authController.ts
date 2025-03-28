import { RequestHandler } from 'express';
import AuthService from '../services/authService';

/**
 * Controller para cadastro de usuário
 */
const cadastroUsuario: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { username, email, telefone, senha, confirmacaoSenha } = req.body;

        const resultado = await AuthService.cadastrarUsuario({
            username,
            email,
            telefone,
            senha,
            confirmacaoSenha
        });

        if (!resultado.success) {
            res.status(400).json(resultado);
            return;
        }

        res.status(201).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor',
        });
    }
};

/**
 * Controller para login de usuário
 */
const loginUsuario: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, senha } = req.body;

        const resultado = await AuthService.loginUsuario({
            email,
            senha
        });

        if (!resultado.success) {
            res.status(400).json(resultado);
            return;
        }

        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor',
        });
    }
};

/**
 * Controller para solicitar código de verificação
 */
const solicitarCodigo: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, tipo } = req.body;

        const resultado = await AuthService.solicitarCodigo({
            email,
            tipo
        });

        if (!resultado.success) {
            res.status(400).json(resultado);
            return;
        }

        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor',
        });
    }
};

/**
 * Controller para redefinir dados do usuário
 */
const redefinirDado: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, codigo, novoDado, tipo } = req.body;

        const resultado = await AuthService.redefinirDado({
            email,
            codigo,
            novoDado,
            tipo
        });

        if (!resultado.success) {
            res.status(400).json(resultado);
            return;
        }

        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor',
        });
    }
};

export {
    cadastroUsuario,
    loginUsuario,
    solicitarCodigo,
    redefinirDado
};