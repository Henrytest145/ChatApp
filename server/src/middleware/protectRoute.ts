import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma";
import { Response, Request, NextFunction } from "express";

interface DecodedToken extends JwtPayload {
    userId: string,
}

const protectRoute = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({message: "No existe token de verificación."});
            return
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (!decoded) {
            res.status(401).json({message: "Token de verificación incorrecto."});
            return
        }
        const user = await prisma.user.findUnique({where:{id:decoded.userId}});
        next()
    } catch (error) {
        console.log(`Error `);
        
    }
}