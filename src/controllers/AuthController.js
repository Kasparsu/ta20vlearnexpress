import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//import CryptoJS from "crypto-js";
import {authenticator} from 'otplib';
import qrCode from 'qrcode';
import jwt from 'jwt-express';

//import jwt from 'jsonwebtoken';
router.get('/register', (req, res, next) => {
    res.render('register.njk');
    next();
});

router.post('/register', async (req, res, next) => {
    const secret = authenticator.generateSecret();
    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                secret: secret
            },
        });
        await prisma.$disconnect();
        qrCode.toDataURL(authenticator.keyuri(req.body.email, 'My node app', secret), (err, url) => {
            if(err) {
                throw err;
            }
            req.session.qr = url;
            req.session.email = req.body.email;
            req.session.message = 'User Created successfully';
            req.session.save();
        });
        res.redirect('/2fa');
    } catch (e) {
        let error = {
            message: e.message.match(/Unique constraint failed on the fields: \(`\w+`\)/g),
            field: e.meta.target
        }
        if (error.message) {
            req.session.error = error;
            req.session.save();
        }
        res.redirect('/register')
    }
    next();
});

router.get('/2fa', (req, res, next) => {
    if(!req.session.qr){
        res.redirect('/');
    } else {
        res.render('2fa.njk', {qr: req.session.qr});
    }
    next();
});

router.post('/2fa', async (req, res, next) => {
    const user = await prisma.user.findFirst({
        where: { email: req.session.email },
    });
    if(user && authenticator.check(req.body.code, user.secret)){
        req.session.qr = null;
        //req.session.token = jwt.sign(req.session.email, 'supersecret');
        res.jwt({
            user
        });
        req.session.email = null;
        res.redirect('/dashboard');
    } else {
        /**  
         * @todo user might not exist either
         */
        req.session.error = {
            message: 'invalid code',
            field: 'code'
        }
        res.redirect('/2fa');
    }

    next();
});

/**  
 * @todo move this to its own controller
 */
router.get('/dashboard', jwt.valid(), (req, res, next) => {
    console.log(req.session);
    console.log(req.auth);
    res.render('dashboard.njk', {email: req.auth});
    next();
});


router.get('/login', (req, res, next) => {
    
    res.render('login.njk');
    next();
});

router.post('/login', async (req, res, next) => {
    console.log(req.body);
    const user = await prisma.user.findFirst({
        where: { email: req.body.email },
    });
    if(user && authenticator.check(req.body.code, user.secret)){
        res.jwt({
            user
        });
        res.redirect('/dashboard');
    } else {
        /**  
         * @todo user might not exist either
         */
        req.session.error = {
            message: 'invalid code',
            field: 'code'
        }
        res.redirect('/2fa');
    }
    next();
});

export default router;