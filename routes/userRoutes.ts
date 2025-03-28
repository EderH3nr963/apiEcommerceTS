import express from 'express';
const router = express.Router();
import { updatePassword, updateName, getUsuario, confirmarNovoEmail, solicitarCodigoNovoEmail, buscarEnderecosDoUsuario, criarEndereco, atualizarEndereco, deletarEndereco, buscarEnderecoPorId } from '../controllers/userController';

router.post('/endereco', criarEndereco);
router.get('/endereco', buscarEnderecosDoUsuario);
router.get('/endereco/:id', buscarEnderecoPorId);
router.put('/endereco/:id', atualizarEndereco);
router.delete('/endereco/:id', deletarEndereco);

router.put("/me/name", updateName);
router.put("/me/password", updatePassword); // testado
router.get("/me", getUsuario); // testado

// Rotas de alteração de email
router.post('/change-email/request', solicitarCodigoNovoEmail); // Solicita código para novo email
router.post('/change-email/confirm', confirmarNovoEmail);       // Confirma alteração de email

export default router;
