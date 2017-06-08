
var express = require('express');
var consign = require('consign');

var app = express();

// Seta variáveis para o servidor.
app.set('view engine', 'ejs');
app.set('views', './core/views');
app.use(express.static('public')); // Seta a pasta "public" como estatica

// Registra todas as rotas no namespace do servidor
consign().include('core/routes').into(app);

module.exports = app;
