// Data Access Object. Aqui será criada a parte de conexão com Banco de Dados
var Promise = require('bluebird');
var ctor = require('mozart');
var cDAO = ctor(function(proto, _, _protected, __, __private){

    __private.DB = null;
    __private.instance = null;

    proto.startInitialization = function(conf, Sequelize){
        return new Promise(function(resolve, reject){

            __(this).DB = new Sequelize(conf.dbname, conf.user, conf.pass, {
                host: conf.host,
                dialect: conf.dialect
            });

            __(this).DB.authenticate().then(function (){
                resolve(this);
            });
        })
    }

    proto.sync = function(){
        //TODO: Implementar Sync, encapsulando o Sync do Sequelize

    }

});


module.exports.init = function(conf, Sequelize){
    return new Promise(function(resolve, reject){
        var aux = null;

        try {
            aux = new cDAO();
            aux.startInitialization(conf, Sequelize).then(function(initializedObj){
                resolve(initializedObj);
            });
        } catch (e) {
            reject(e);
        }
    })
}
