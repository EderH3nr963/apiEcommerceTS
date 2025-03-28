import express, { Router} from 'express';
import { isAdmin } from '../middlewares/isAdmin';

const router: Router = express.Router();

router.get("/", () => {});
router.get("/:id", () => {});

router.post("/", isAdmin, () => {});
router.put("/:id", isAdmin, () => {});
router.delete("/:id", isAdmin, () => {});

router.get("/:id/imagem", () => {});
router.post("/:id/imagem", isAdmin, () => {});
router.delete("/:id/imagem", isAdmin, () => {});

export default router;
