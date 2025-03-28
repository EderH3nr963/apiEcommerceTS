import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
    id: number;
    role: string; // Pode ser "admin" ou "user"
}

declare global {
    namespace Express {
        interface Request {
            user?: number;
        }
    }
}

export const authMiddleware: RequestHandler = async (req, res, next): Promise<void> => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acesso negado. Faça login." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        req.user = decoded.id; // Adiciona o usuário na requisição
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido." });
    }
};
