var Glob = require('glob');
var Path = require('path');
var consign = require('consign');

module.exports = function(serv){

    consign()
    .include('core/models')
    .into(serv);

    // Renomeia namespaces desnecessariamente longos
    serv.DAO.models = serv.core.models;
    delete serv.core.models;
}
