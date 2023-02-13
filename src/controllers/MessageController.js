import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jwt-express';

router.get('/', jwt.valid(), async (req, res) => {
    const messages = await prisma.message.findMany();
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
    });
    
    return res.json(message);
});

export default router;