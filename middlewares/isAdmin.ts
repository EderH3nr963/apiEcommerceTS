import { NextFunction, Request, Response } from "express";
import UsuarioModel from "../models/usuarioModel";

declare module 'express' {
    interface Request {
        user?: number;
    }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user;

    if (!userId) {
        res.status(401).json({
            success: false,
            message: 'Não autorizado'
        });
        return;
    }

    const usuario = await UsuarioModel.findById(userId);

    if (!usuario?.isAdmin) {
        res.status(403).json({
            success: false,
            message: 'Acesso negado'
        });
        return;
    }

    next();
}