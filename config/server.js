
var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var sequelize = require('sequelize');
var Promise = require('bluebird');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var helmet = require('helmet');
var colors = require('colors');
var uuid = require('uuid-base62');


console.log('\n\n\n');
console.log(uuid.v4());
console.log(colors.yellow('Initializing Server -> %s'), (process.env.NODE_ENV == 'prod') ? 'Production' : 'Development');
console.log('\n');

var app = express();
global.getServer = function(){
    return app;
}

/*
    MODULO DO SERVER

    Modulo do servidor faz uso de Promises para carregar de forma síncrona todos os
    requisitos assíncronos do sistema (autenticação do banco de dados por exemplo);
*/

// Objeto de Erros
app.errors = {
    unauthorized : false
}

module.exports = new Promise(function(resolve, reject){

    // Seta variáveis para o servidor.
    app.set('view engine', 'ejs');
    app.set('views', './core/views');
    app.use(express.static('public')); // Seta a pasta "public" como estatica

    // Registra configurações no objeto de Servidor
    var configPath = (process.env.NODE_ENV == 'prod') ? 'prod_conf.json' : 'dev_conf.json';
    app.servConfig = require(__dirname + '/' + configPath);

    //HACK: Adicionando uma função de encriptação e decriptação no Server
    app.encrypt = function(str, salt){
        const crypto = require('crypto');
        var configs = app.servConfig.crypto;
        var hash = crypto.pbkdf2Sync(str, salt, 10000, 256, 'sha256');
        return hash;
    }

    app.compare = function (hash, attempt, salt){
        const crypto = require('crypto');
        return hash == crypto.pbkdf2(attempt, salt, 10000, 256, 'sha256');
    }

    var DAO = require(__dirname + '/' + 'DAO.js');

    //Inicializa o DAO e Resolve ou rejeita a Promise principal
    DAO.init(app.servConfig.database, sequelize).then(function(objDAO){
        if(objDAO){

            app.DAO = objDAO;
        } else {
            reject('failed: objDAO is Undefined');
        }
    }).then(function(){
        // Define os Models e coloca-os no App
        var models = require('./models.js');

    }).then(function(){

        //Middlewares
        app.use(helmet({
            contentSecurityPolice: true,
            referrerPolicy: true
        }));
        app.use(bodyParser.urlencoded({extended: true}));
        // app.use(cookieParser());

        // Configura middleware para lidar com sessões de usuário
        app.use(session({
            secret: app.servConfig.cookieSecret,
            cookie: {
                maxAge: 3600000,
                httpOnly: true
            },
            store: new SequelizeStore({
                db: app.DAO.getDB()
            }),
            proxy: true,
            resave: false,
            saveUninitialized: false
        }))

    }).then(function(){
        // Registra todas as rotas no namespace do servidor
        // .then('core/models')
        consign().include('core/vendors/parents')
        .into(app);

        // Renomeia namespaces desnecessariamente longos
        app.core.parents = app.core.vendors.parents
        delete app.config;
        delete app.core.vendors.parents;

        consign().include('config/models.js')
        .then('core/routes')
        .into(app);

        console.log('\n==> Starting DB Synchronizing'.yellow);
        return app.DAO.sync();
    }).then(function(){

        resolve(app);
    });
});
