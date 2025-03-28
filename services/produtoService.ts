import ProdutoModel, { Produto } from "../models/produtoModel";
import CategoriaModel, { Categoria } from "../models/categoriaModel";
import UsuarioModel, { Usuario } from "../models/usuarioModel";
import OrderModel, { OrderCreate } from "../models/orderModel";
import EnderecoModel, { Endereco } from "../models/enderecoModel";
import { MercadoPagoConfig, Payment } from 'mercadopago';


interface PaymentData {
    transaction_amount: number;
    token: string;
    description: string;
    installments: number;
    payment_method_id: string;
    issuer_id: string;
    payer: {
        email: string;
        identification: {
            type: string;
            number: string;
        };
    };
}

class ProdutoService {
    static async getAll(values: void): Promise<{ success: boolean, message: string, produtos: Produto[] }> {
        try {
            const produtos = await ProdutoModel.getAll();

            if (!produtos) {
                return {
                    success: false,
                    message: 'Nenhum produto encontrado',
                    produtos: []
                }
            }

            return {
                success: true,
                message: 'Produtos encontrados com sucesso',
                produtos
            }
        } catch (error) {
            return {
                success: false,
                message: 'Erro interno no servidor',
                produtos: []
            }
        }
    }

    static async getById(id: number): Promise<{ success: boolean, message: string, produto: Produto | null }> {
        try {
            const produto = await ProdutoModel.getById(id);

            if (!produto) {
                return {
                    success: false,
                    message: 'Produto não encontrado',
                    produto: null
                }
            }

            return {
                success: true,
                message: 'Produto encontrado com sucesso',
                produto
            }
        } catch (error) {
            return {
                success: false,
                message: 'Erro interno no servidor',
                produto: null
            }
        }
    }

    // Admin
    static async create(produto: Produto): Promise<{ success: boolean, message: string | null }> {
        try {
            const response = await ProdutoModel.create(produto);

            if (!response) {
                return {
                    success: false,
                    message: 'Erro ao criar produto',
                }
            }

            return {
                success: true,
                message: 'Produto criado com sucesso',
            }
        } catch (error) {
            return {
                success: false,
                message: 'Erro interno no servidor',
            }
        }
    }

    // Admin
    static async update(id: number, produto: Produto): Promise<{ success: boolean, message: string | null }> {
        try {
            const response = await ProdutoModel.update(id, produto);

            if (!response) {
                return {
                    success: false,
                    message: 'Erro ao atualizar produto',
                }
            }

            return {
                success: true,
                message: 'Produto atualizado com sucesso',
            }
        } catch (error) {
            return {
                success: false,
                message: 'Erro interno no servidor',
            }
        }
    }

    // Admin
    static async delete(id: number): Promise<{ success: boolean, message: string | null }> {
        try {
            const response = await ProdutoModel.delete(id);

            if (!response) {
                return {
                    success: false,
                    message: 'Erro ao deletar produto',
                }
            }

            return {
                success: true,
                message: 'Produto deletado com sucesso',
            }
        } catch (error) {
            return {
                success: false,
                message: 'Erro interno no servidor',
            }
        }
    }

    static async getByCategoria(categoria: string): Promise<{ success: boolean, message: string, produtos: Produto[] }> {
        try {

            const categoriaRetornada: Categoria | null = await CategoriaModel.getByCampo('nome', categoria);

            if (!categoriaRetornada || !categoriaRetornada.id) {
                return {
                    success: false,
                    message: 'Categoria não encontrada',
                    produtos: []
                }
            }

            const produtos = await ProdutoModel.getByCategoria(categoriaRetornada.id);

            if (!produtos) {
                return {
                    success: false,
                    message: 'Nenhum produto encontrado',
                    produtos: []
                }
            }

            return {
                success: true,
                message: 'Produtos encontrados com sucesso',
                produtos
            }
        } catch (error) {
            return {
                success: false,
                message: 'Erro interno no servidor',
                produtos: []
            }
        }
    }

    static async processPayment(idProduto: number, idUsuario: number, idEndereco: number, paymentData: PaymentData, quantity: number) {
        try {
            // Buscar produto no banco de dados
            const produto = await ProdutoModel.getById(idProduto);
            if (!produto || !produto.id || typeof produto.id !== 'number') {
                return { success: false, message: 'Produto não encontrado' };
            }
    
            // Buscar usuário no banco de dados
            const usuario = await UsuarioModel.findById(idUsuario);
            if (!usuario || !usuario.id || typeof usuario.id !== 'number') {
                return { success: false, message: 'Usuário não encontrado' };
            }

            const endereco = await EnderecoModel.getById(idEndereco);
            if (!endereco || !endereco.id || typeof endereco.id !== 'number') {
                return { success: false, message: 'Endereço não encontrado' };
            }
    
            // Configurar cliente do Mercado Pago
            const client = new MercadoPagoConfig({
                accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
                options: { timeout: 5000, idempotencyKey: 'abc' }
            });
    
            // Inicializar API de pagamentos
            const payment = new Payment(client);
    
            // Criar pagamento no Mercado Pago
            await payment.create({
                body: {
                    transaction_amount: paymentData.transaction_amount, // Corrigido para pegar o valor do produto
                    token: paymentData.token, // Usando paymentData, pois é o argumento correto
                    description: produto.nome,
                    installments: paymentData.installments,
                    payment_method_id: paymentData.payment_method_id,
                    issuer_id: Number(paymentData.issuer_id),
                    payer: {
                        email: paymentData.payer.email,
                        identification: {
                            type: paymentData.payer.identification.type,
                            number: paymentData.payer.identification.number
                        }
                    }
                },
                requestOptions: { idempotencyKey: '<SOME_UNIQUE_VALUE>' }
            })
            .then(response => {
                let statusPay = '';

                switch (response.status) {
                    case 'approved':
                        statusPay = 'confirmado';
                        break;
                    case 'rejected':
                        statusPay = 'cancelado';
                        break;
                    default:
                        statusPay = 'pendente';
                        break;
                }
    
                if (!produto.id || !usuario.id) {
                    return { success: false, message: 'Produto ou usuário não encontrado' };
                }

                const orderCreate: OrderCreate = {
                    quantidade: quantity,
                    usuario: idUsuario,
                    produto: idProduto,
                    endereco: idEndereco,
                    statusOrder: statusPay,
                    create_at: new Date()
                }

                // Corrigido erro de digitação (usuario.endereco)
                OrderModel.create(orderCreate);

                return { success: true, message: 'Pagamento processado com sucesso' };
            })
            .catch(error => {
                console.error('Erro ao processar pagamento:', error);
                return { success: false, message: 'Erro ao processar pagamento', error: error.message };
            })
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            return { success: false, message: 'Erro ao processar pagamento'};
        }
    }
    


}

export default ProdutoService;
