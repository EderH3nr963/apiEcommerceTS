import UsuarioModel from '../models/usuarioModel';
import jwt from 'jsonwebtoken';
import redis from '../config/redisConfig';
import enviarEmail from '../lib/sendMail';
import gerarCodigo from '../lib/gerarCodigo';

class AuthService {
    /**
     * Cadastra um novo usuário
     */
    static async cadastrarUsuario(dados: {
        username: string;
        email: string;
        telefone: string;
        senha: string;
        confirmacaoSenha: string;
    }): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const { username, email, telefone, senha, confirmacaoSenha } = dados;

            // Regex para validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validação dos campos obrigatórios
            if (!username || !email || !telefone || !senha) {
                return {
                    success: false,
                    message: 'Todos os campos são obrigatórios'
                };
            }

            // Validação de confirmação de senha
            if (senha !== confirmacaoSenha) {
                return {
                    success: false,
                    message: 'As senhas não coincidem'
                };
            }

            // Validação do formato do email
            if (!emailRegex.test(email)) {
                return {
                    success: false,
                    message: 'Email inválido'
                };
            }

            // Verifica se o email já está cadastrado
            if (await UsuarioModel.findByEmail(email)) {
                return {
                    success: false,
                    message: 'Email já cadastrado'
                };
            }

            // Cria o usuário no banco de dados
            const result = await UsuarioModel.create({
                username,
                email,
                telefone,
                senha
            });

            if (!result) {
                return {
                    success: false,
                    message: 'Erro ao cadastrar usuário'
                };
            }

            return {
                success: true,
                message: 'Usuário cadastrado com sucesso'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao cadastrar usuário'
            };
        }
    }

    /**
     * Realiza o login do usuário
     */
    static async loginUsuario(dados: {
        email: string;
        senha: string;
    }): Promise<{
        success: boolean;
        message: string;
        token?: string;
    }> {
        try {
            const { email, senha } = dados;

            // Validação dos campos obrigatórios
            if (!email || !senha) {
                return {
                    success: false,
                    message: 'Todos os campos são obrigatórios'
                };
            }

            // Busca o usuário pelo email
            const usuario = await UsuarioModel.findByEmail(email);

            // Verifica se o usuário existe
            if (!usuario || typeof usuario === 'boolean') {
                return {
                    success: false,
                    message: 'Usuário ou senha inválidos'
                };
            }

            // Verifica se a senha está correta
            if (!await UsuarioModel.comparePassword(senha, usuario.senha)) {
                return {
                    success: false,
                    message: 'Usuário ou senha inválidos'
                };
            }

            // Atualiza a data do último login
            await UsuarioModel.updateLoggedAt(usuario.id);

            // Gera o token JWT
            const token = jwt.sign(
                { id: usuario.id },
                process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
                { expiresIn: '1h' }
            );

            return {
                success: true,
                message: 'Login realizado com sucesso',
                token
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao realizar login'
            };
        }
    }

    /**
     * Solicita código de verificação para recuperação de senha ou alteração de email
     */
    static async solicitarCodigo(dados: {
        email: string;
        tipo: 'email' | 'senha';
    }): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const { email, tipo } = dados;

            const usuario = await UsuarioModel.findByEmail(email);
            if (!usuario) {
                return {
                    success: false,
                    message: 'Usuário não encontrado'
                };
            }

            const codigo = gerarCodigo();
            const chaveRedis = `codigo:${usuario.id}:${tipo}`;

            // Armazena no Redis com expiração de 10 minutos
            await redis.set(chaveRedis, codigo, 'EX', 600);

            await enviarEmail(email, codigo);

            return {
                success: true,
                message: 'Código enviado por e-mail'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao solicitar código'
            };
        }
    }

    /**
     * Redefine senha ou email do usuário usando código de verificação
     */
    static async redefinirDado(dados: {
        email: string;
        codigo: string;
        novoDado: string;
        tipo: 'email' | 'senha';
    }): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const { email, codigo, novoDado, tipo } = dados;

            const usuario = await UsuarioModel.findByEmail(email);
            if (!usuario) {
                return {
                    success: false,
                    message: 'Usuário não encontrado'
                };
            }

            const chaveRedis = `codigo:${usuario.id}:${tipo}`;
            const codigoSalvo = await redis.get(chaveRedis);

            if (!codigoSalvo || codigoSalvo !== codigo) {
                return {
                    success: false,
                    message: 'Código inválido ou expirado'
                };
            }

            let atualizado = false;
            if (tipo === 'senha') {
                atualizado = await UsuarioModel.updatePassword(usuario.id, novoDado);
            } else if (tipo === 'email') {
                atualizado = await UsuarioModel.update(usuario.id, { email: novoDado });
            }

            // Remove o código do Redis após uso
            await redis.del(chaveRedis);

            if (!atualizado) {
                return {
                    success: false,
                    message: `Erro ao atualizar ${tipo}`
                };
            }

            return {
                success: true,
                message: 'Alteração realizada com sucesso'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao redefinir dado'
            };
        }
    }
}

export default AuthService;
