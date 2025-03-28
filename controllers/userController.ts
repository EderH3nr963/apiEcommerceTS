import { RequestHandler } from 'express';
import UserService from '../services/userService';

/**
 * Controller para buscar dados do usuário autenticado
 */
const getUsuario: RequestHandler = async (req, res): Promise<void> => {
    try {
        const id = Number(req.user);
        const resultado = await UserService.buscarUsuarioPorId(id);

        if (!resultado.success) {
            res.status(404).json(resultado);
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
 * Controller para listar todos os usuários
 */
const getAllUsuarios: RequestHandler = async (req, res): Promise<void> => {
    try {
        const resultado = await UserService.listarUsuarios();

        if (!resultado.success) {
            res.status(404).json(resultado);
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
 * Controller para atualizar dados do usuário
 */
const updateName: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const { username } = req.body;

        const resultado = await UserService.atualizarNome(userId, username);

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
 * Controller para atualizar senha do usuário
 */
const updatePassword: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const { senha, confirmacaoSenha } = req.body;

        const resultado = await UserService.atualizarSenha(userId, senha, confirmacaoSenha);

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
 * Controller para solicitar código de verificação para novo email
 */
const solicitarCodigoNovoEmail: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const { novoEmail } = req.body;

        const resultado = await UserService.solicitarCodigoEmail(userId, novoEmail);

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
 * Controller para confirmar alteração de email
 */
const confirmarNovoEmail: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const { novoEmail, codigo } = req.body;

        const resultado = await UserService.confirmarNovoEmail(userId, novoEmail, codigo);

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
 * Controller para buscar endereços do usuário
 */
const buscarEnderecosDoUsuario: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const resultado = await UserService.buscarEnderecosDoUsuario(userId);
        
        if (!resultado.success) {
            res.status(404).json(resultado);
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
}

/**
 * Controller para criar endereço
 */
const criarEndereco: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const endereco = req.body;
        
        const resultado = await UserService.criarEndereco(userId, endereco);

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
}   

/**
 * Controller para atualizar endereço
 */
const atualizarEndereco: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const enderecoId = Number(req.params.id);
        const endereco = req.body;

        const resultado = await UserService.atualizarEndereco(userId, enderecoId, endereco);
        
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
}

/**
 * Controller para deletar endereço
 */
const deletarEndereco: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const enderecoId = Number(req.params.id);

        const resultado = await UserService.deletarEndereco(userId, enderecoId);
        
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
}

/**
 * Controller para buscar endereço por ID
 */
const buscarEnderecoPorId: RequestHandler = async (req, res): Promise<void> => {
    try {
        const userId = Number(req.user);
        const enderecoId = Number(req.params.id);

        const resultado = await UserService.buscarEnderecoPorId(userId, enderecoId);
        
        if (!resultado.success) {
            res.status(404).json(resultado);
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
}

export { 
    getUsuario, 
    getAllUsuarios,
    updateName,
    updatePassword,
    solicitarCodigoNovoEmail,
    confirmarNovoEmail,
    buscarEnderecosDoUsuario,
    criarEndereco,
    atualizarEndereco,
    deletarEndereco,
    buscarEnderecoPorId
};
