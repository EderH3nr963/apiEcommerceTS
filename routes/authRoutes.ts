import express, { Router } from 'express';
import { cadastroUsuario, loginUsuario, redefinirDado, solicitarCodigo } from '../controllers/authController';

const router: Router = express.Router();

// Rotas de autenticação básica
router.post('/register', cadastroUsuario); // Cadastro de novo usuário - testado
router.post('/login', loginUsuario);       // Login de usuário - testado

// Rotas de recuperação de senha
router.post('/recovery', solicitarCodigo);  // Solicita código de verificação
router.post('/reset', redefinirDado);       // Redefine senha com código


export default router;
