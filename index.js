//const express = require('express');
//const nunjucks = require('nunjucks');
//const path = require('path');
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const app = express();
const port = 3000;

app.set('views', './views');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', async (request, response) => {
  const users = await prisma.user.findMany();
  await prisma.$disconnect()
  console.log(users);
  response.render('index.njk');
});

app.get('/page1', (request, response) => {
    response.render('index.njk');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});