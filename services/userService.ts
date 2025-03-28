import UsuarioModel, { Usuario } from '../models/usuarioModel';
import redis from '../config/redisConfig';
import enviarEmail from '../lib/sendMail';
import gerarCodigo from '../lib/gerarCodigo';
import EnderecoModel, { Endereco } from '../models/enderecoModel';

interface UsuarioResponse {
    id: number;
    username: string;
    email: string;
    telefone: string;
    create_at: Date;
    logged_at: Date;
}

class UserService {
    /**
     * Busca um usuário pelo ID
     */
    static async buscarUsuarioPorId(id: number): Promise<{
        success: boolean;
        message: string;
        usuario?: UsuarioResponse;
    }> {
        try {
            const usuario = await UsuarioModel.findById(id);

            if (!usuario) {
                return {
                    success: false,
                    message: 'Usuário não encontrado'
                };
            }

            return {
                success: true,
                message: 'Usuário encontrado com sucesso',
                usuario: {
                    id: usuario.id,
                    username: usuario.username,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    create_at: usuario.create_at,
                    logged_at: usuario.logged_at
                }
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao buscar usuário'
            };
        }
    }

    /**
     * Lista todos os usuários
     */
    static async listarUsuarios(): Promise<{
        success: boolean;
        message: string;
        usuarios?: UsuarioResponse[];
    }> {
        try {
            const usuarios = await UsuarioModel.findAll();

            if (!usuarios || usuarios.length === 0) {
                return {
                    success: false,
                    message: 'Nenhum usuário encontrado'
                };
            }

            return {
                success: true,
                message: 'Usuários encontrados com sucesso',
                usuarios: usuarios.map(usuario => ({
                    id: usuario.id,
                    username: usuario.username,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    create_at: usuario.create_at,
                    logged_at: usuario.logged_at
                }))
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao listar usuários'
            };
        }
    }

    /**
     * Atualiza o nome do usuário
     */
    static async atualizarNome(userId: number, username: string): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            if (!username) {
                return {
                    success: false,
                    message: 'Nome de usuário não fornecido'
                };
            }

            const atualizado = await UsuarioModel.updateName(userId, username);

            if (!atualizado) {
                return {
                    success: false,
                    message: 'Erro ao atualizar nome do usuário'
                };
            }

            return {
                success: true,
                message: 'Nome atualizado com sucesso'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao atualizar nome do usuário'
            };
        }
    }

    /**
     * Atualiza a senha do usuário
     */
    static async atualizarSenha(userId: number, senha: string, confirmacaoSenha: string): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            if (!senha || !confirmacaoSenha) {
                return {
                    success: false,
                    message: 'Todos os campos são obrigatórios'
                };
            }

            if (senha !== confirmacaoSenha) {
                return {
                    success: false,
                    message: 'As senhas não coincidem'
                };
            }

            const atualizado = await UsuarioModel.updatePassword(userId, senha);

            if (!atualizado) {
                return {
                    success: false,
                    message: 'Erro ao atualizar senha'
                };
            }

            return {
                success: true,
                message: 'Senha atualizada com sucesso'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao atualizar senha'
            };
        }
    }

    /**
     * Solicita código para alteração de email
     */
    static async solicitarCodigoEmail(userId: number, novoEmail: string): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const emailExistente = await UsuarioModel.findByEmail(novoEmail);
            if (emailExistente) {
                return {
                    success: false,
                    message: 'Este e-mail já está em uso'
                };
            }

            const codigo = gerarCodigo();
            const chaveRedis = `verificar-email:${userId}:${novoEmail}`;

            await redis.set(chaveRedis, codigo, 'EX', 600);
            await enviarEmail(novoEmail, codigo);

            return {
                success: true,
                message: 'Código enviado para o novo e-mail'
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
     * Confirma alteração de email
     */
    static async confirmarNovoEmail(userId: number, novoEmail: string, codigo: string): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const chaveRedis = `verificar-email:${userId}:${novoEmail}`;
            const codigoSalvo = await redis.get(chaveRedis);

            if (!codigoSalvo || codigoSalvo !== codigo) {
                return {
                    success: false,
                    message: 'Código inválido ou expirado'
                };
            }

            const atualizado = await UsuarioModel.update(userId, { email: novoEmail });
            await redis.del(chaveRedis);

            if (!atualizado) {
                return {
                    success: false,
                    message: 'Erro ao atualizar e-mail'
                };
            }

            return {
                success: true,
                message: 'E-mail atualizado com sucesso'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao confirmar novo e-mail'
            };
        }
    }

    static async buscarEnderecosDoUsuario(userId: number): Promise<{
        success: boolean;
        message: string;
        enderecos?: Endereco[];
    }> {
        try {
            const enderecos = await EnderecoModel.getAllByIdUsuario(userId);
            return {
                success: true,
                message: 'Endereços encontrados com sucesso',
                enderecos
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Erro ao buscar endereços'
            };
        }
    }

    static async buscarEnderecoPorId(idUsuario: number, enderecoId: number): Promise<{
        success: boolean;
        message: string;
        endereco?: Endereco;
    }> {
        try {
            const endereco = await EnderecoModel.getById(enderecoId);
            if (!endereco) {
                return {
                    success: false,
                    message: 'Endereço não encontrado'
                }
            }

            if (endereco.usuario !== idUsuario) {
                return {
                    success: false,
                    message: 'Endereço não encontrado'
                }
            }

            return {
                success: true,
                message: 'Endereço encontrado com sucesso',
                endereco
            }
        } catch {
            return {
                success: false,
                message: 'Erro ao buscar endereço'
            }
        }
    }

    static async criarEndereco(idUsuario: number, endereco: Endereco): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const criado = await EnderecoModel.create({ ...endereco, usuario: idUsuario });
            return {
                success: true,
                message: 'Endereço criado com sucesso'
            };
        } catch {
            return {
                success: false,
                message: 'Erro ao criar endereço'
            }
        } 
    }

    static async atualizarEndereco(idUsuario: number, enderecoId: number, endereco: Endereco): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const enderecoExistente = await EnderecoModel.getById(enderecoId);
            if (!enderecoExistente) {
                return {
                    success: false,
                    message: 'Endereço não encontrado'
                }
            }

            if (enderecoExistente.usuario !== idUsuario) {
                return {
                    success: false,
                    message: 'Endereço não encontrado'
                }
            }

            const atualizado = await EnderecoModel.update(enderecoId, endereco);
            return {
                success: true,
                message: 'Endereço atualizado com sucesso'
            }
        } catch {
            return {
                success: false,
                message: 'Erro ao atualizar endereço'
            }
        }
    }

    static async deletarEndereco(idUsuario: number, enderecoId: number): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const enderecoExistente = await EnderecoModel.getById(enderecoId);
            if (!enderecoExistente) {
                return {
                    success: false,
                    message: 'Endereço não encontrado'
                }
            }

            if (enderecoExistente.usuario !== idUsuario) {
                return {
                    success: false,
                    message: 'Endereço não encontrado'
                }
            }

            const deletado = await EnderecoModel.delete(enderecoId);
            return {
                success: true,
                message: 'Endereço deletado com sucesso'
            }
        } catch {
            return {
                success: false,
                message: 'Erro ao deletar endereço'
            }
        }
    }
}

export default UserService;
