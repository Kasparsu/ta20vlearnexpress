import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jwt-express';

router.get('/', jwt.valid(), async (req, res) => {
    let messages = [];
    do {
        messages = await prisma.message.findMany( {
            where: {
                timestamp: {
                    gt: req.query.from,
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            }
        });
        await new Promise(r => setTimeout(r, 1000));
    } while (messages.length === 0);
    return res.json(messages);
});

router.post('/', jwt.valid(), async (req, res) => {
    const message = await prisma.message.create({
        data: {
            message: req.body.message,
            timestamp: new Date(),
            // @ts-ignore
            userId: req.jwt.payload.user.id
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        }
    });
    
    return res.json(message);
});

export default router;