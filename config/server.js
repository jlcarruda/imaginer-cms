
var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var sequelize = require('sequelize');
var Promise = require('bluebird');

var app = express();

/*
    MODULO DO SERVER
    
    Modulo do servidor faz uso de Promises para carregar de forma síncrona todos os
    requisitos assíncronos do sistema (autenticação do banco de dados por exemplo);
*/

module.exports = new Promise(function(resolve, reject){

    // Seta variáveis para o servidor.
    app.set('view engine', 'ejs');
    app.set('views', './core/views');
    app.use(express.static('public')); // Seta a pasta "public" como estatica

    // Registra configurações no objeto de Servidor
    var configPath = (process.env.NODE_ENV == 'prod') ? 'prod_conf.json' : 'dev_conf.json';
    app.servConfig = require(__dirname + '/' + configPath);

    var DAO = require(__dirname + '/' + 'DAO.js');

    //Inicializa o DAO e Resolve ou rejeita a Promise principal
    DAO.init(app.servConfig.database, sequelize).then(function(objDAO){
        if(objDAO){
            app.DAO = objDAO;
        } else {
            reject('failed: objDAO is Undefined');
        }
    }).then(function(){
        //Middlewares
        app.use(bodyParser.urlencoded({extended: true}));

        // Registra todas as rotas no namespace do servidor
        consign().include('core/routes')
        .then('core/models')
        .into(app);

        resolve(app);
    });

});
