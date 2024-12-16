import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken";

export const signup = async (req: Request, res: Response)=> {
    try {
        const {fullName, username,password,confirmPassword, gender} = req.body; 

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            console.log("err1");
            
            res.status(400).json({error: "Completa todos los campos."});
            return 
        }
        if (password !== confirmPassword) {
            
            res.status(400).json({error: "Las contraseñas no son iguales."});
            return
        }

        const user = await prisma.user.findUnique({where: {username}});
        if (user) {
            res.status(400).json({error: "El usuario ya existe."});
            return
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?userame=${username}`;
        const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?userame=${username}`;

        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === 'male' ? maleProfilePic : femaleProfilePic,
            }
        });

        if (newUser) {

            generateToken(newUser.id, res);

            res.status(200).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({error: "Informacion de usuario invalida."});
            return 
        }
    } catch (error:any) {
        console.log(`Error en el controlador signup: ${error.message}`);
        res.status(500).json({message:"Error de servidor"});
    }
}
export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try {
        const user = await prisma.user.findUnique({where:{username}});
    if (!user) {
        res.status(400).json({message:"El usuario no existe."});
        return
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
        res.status(400).json({message:"La contraseña es incorrecta"});
        return
    }

    generateToken(user.id, res);

    res.status(200).json({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
    });
    } catch (error:any) {
        console.log(`Error en el controlador login: ${error.message}`);
        res.status(500).json({message: "Error en el servidor"});
    }
}
export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"Sesion cerrada con exito."});
    } catch (error:any) {
        console.log(`Error en el controlador logout: ${error.message}`);
        res.status(400).json({message:"Error en el servidor."});
    }
}

export const getMe = async (req:Request, res:Response) => {
    try {
        const user = await prisma.user.findUnique({where:{id:req.user.id}});
    } catch (error:any) {
        console.log(`Error en el controlador getMe: ${error.message}`);
        res.status(400).json({message:"Error en el servidor."});        
    }
}
