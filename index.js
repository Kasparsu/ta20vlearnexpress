const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const app = express();
const port = 3000;

app.set('views', './views');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', (request, response) => {
  response.render('index.html');
});

app.get('/page1', (request, response) => {
    response.render('index.html');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});