import { Request, Response } from "express";
import prisma from "../db/prisma";

export const sendMessage = async (req:Request, res:Response) => {
    try {
        console.log("EJECUTANDO SENDMESSAGE CONTROLLER");
        
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user.id;

        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                }
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds:{
                        set: [senderId, receiverId],
                    }
                }
            });
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body:message,
                conversationId: conversation.id,
            },
        })

        if (message) {
            conversation = await prisma.conversation.update({
                where:{
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        }
                    }
                }
            })
        }


        res.status(201).json(newMessage);
    } catch (error:any) {
        console.log("Error enviar mensaje controller", error.message);
        res.status(500).json({error: "Error en el servidor."});
    }
}

export const getMessages = async (req:Request, res:Response) => {
    try {
        const {id:userToChatId} = req.params;
        const senderId = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId],
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    }
                }
            }
        });

        if (!conversation) {
            res.status(200).json([]);
            return
        }

        res.status(200).json(conversation.messages);
    } catch (error:any) {
        console.log("Error en el controlador germessages: ", error.message);
        res.status(500).json({message:"Error en el server."});
    }
}

export const getUsersForSideBar = async (req:Request, res:Response) => {
    try {
        const userId = req.user.id;
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: userId
                }
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true
            }
        })

        res.status(200).json(users);

    } catch (error:any) {
        console.log("Error en el controlador getUsersForSideBar");
        res.status(400).json({message: error.message});
    }
}