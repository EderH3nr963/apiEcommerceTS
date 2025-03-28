import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import produtoRoutes from './routes/produtoRoutes';
const app = express();

dotenv.config();

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/v1/auth', authRoutes); // Rotas de autenticação
app.use('/api/v1/user', authMiddleware, userRoutes); // Rotas de usuário
app.use('/api/v1/produto', authMiddleware, produtoRoutes); // Rotas de produto
/* app.use('/api/v1/order'); // Rotas de pedido
app.use('/api/v1/admin'); // Rotas de admin */

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
