import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//import CryptoJS from "crypto-js";
import {authenticator} from 'otplib';
import qrCode from 'qrcode';
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



router.get('/login', (req, res, next) => {
    
    res.render('login.njk');
    next();
});

router.post('/login', async (req, res, next) => {
    
    let hash = CryptoJS.HmacSHA1(new Date().toISOString(), "asdasd");
    console.log(hash.toString());
    const user = await prisma.user.update({
        where: { email: req.body.email },
        data: { loginToken: hash.toString() },
    });
    req.session.login = {
        token: hash.toString(),
    }
    req.session.save();
    console.log(req.session);
    res.redirect('/email');
    next();
});

router.get('/emaillogin', async (req, res, next) => {
    const user = await prisma.user.update({
        where: { loginToken: req.query.token },
        data: { shouldLogIn: true },
    });
    
    res.render('loggedin.njk');
    next();
});

router.get('/email', async (req, res, next) => {
    console.log(req.session);
    if(req.session.login){
        const user = await prisma.user.findFirst({
            where: { loginToken: req.session.login.token, shouldLogIn: true},
        });
        console.log(user);
        if(user){
            req.session.user = user;
            await prisma.user.update({
                where: { loginToken: req.session.login.token },
                data: { shouldLogIn: false, loginToken: null },
            });
            res.redirect('/');
        } else {
            res.render('email.njk');
        }
    } else {
        res.render('email.njk');
    }
    next();
});
export default router;