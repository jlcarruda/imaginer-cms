// Data Access Object. Aqui será criada a parte de conexão com Banco de Dados
var Promise = require('bluebird');
var ctor = require('mozart');

// Classe do DAO criada pelo Mozart
var cDAO = ctor(function(proto, _, _protected, __, __private){

    proto.foo = 'bar';

    // Função para começar LazyLoad
    proto.startInitialization = function(conf, Sequelize){
        var self = this;
        Sequelize.UUID = Sequelize.CHAR(22).BINARY; // Atribuição de novo tipo de dado no Sequelize
        return new Promise(function(resolve, reject){

            _(self).Sequelize = Sequelize;

            _(self).DB = new Sequelize(conf.dbname, conf.user, conf.pass, {
                host: conf.host,
                dialect: conf.dialect
            });

            _(self).DB.authenticate().then(function (){
                resolve();
            });

        });
    }

    this.addGetters('DB', 'Sequelize');

    proto.sync = function(){
        return _(this).DB.sync();
    }

});



module.exports.init = function(conf, Sequelize){
    return new Promise(function(resolve, reject){
        var aux = null;

        try {
            aux = new cDAO();
            aux.startInitialization(conf, Sequelize).then(function(){
                resolve(aux);
            });
        } catch (e) {
            reject(e);
        }
    })
}
