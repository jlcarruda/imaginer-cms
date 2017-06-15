/**
*   Classe pai para todos os ModelConstructors (MC)
*
* ModelConstructors são classes que encapsulam toda a lógica de definição e criação
*    do model pelo Sequelize. Assim que o Model for criado, ele será incrementado
*    ao próprio objeto.
*/
var ctor = require('mozart');
var Error = require('common-errors');

var pModelConstructor = ctor(function(proto, _, _protected, __, __private){

    _protected.isCommitted = false;

    // Class Constructor
    proto.init = function(name, schema, classMethods, instanceMethods, hooks){
        if(name == undefined){
            throw new Error.ArgumentNullError('name');
        }
        _(this).name = name;
        _(this).schema = (schema) ? schema : {};
        _(this).classMethods = (classMethods) ? classMethods : {};
        _(this).instanceMethods = (instanceMethods) ? instanceMethods : {};
        _(this).hooks = (hooks) ? hooks : {};
    }

    // Metodo privado para trancar qualquer mudança na classe.
    _protected.commit = function(){
        _(this).isCommitted = true;
        delete this.define;
        delete this.setSchema;
        delete this.setClassMethods;
        delete this.setHooks;
        delete this.setInstanceMethods;
    }

    // Gera um model a partir do construtor e o assimila ao mesmo.
    proto.define = function(db){
        var self_protected = _(this);

        // Assimila o objeto Model do sequelize ao prototipo publico desta classe
        Object.assign(this, db.define(self_protected.name, self_protected.schema, {
            freezeTableName: true,
            classMethods: self_protected.classMethods,
            instanceMethods: self_protected.instanceMethods,
            hooks: self_protected.hooks
        }));

        // Bloqueia qualquer outra tentativa de definir ou modificar o próprio model.
        _(this).commit();
    }


    // Função para associar um model ao outro.
    /*
    {
        <modelo a ser associado> : {
            association: <tipo de associação (hasOne, hasMany, etc)>,
            options: <JSON opcional com as opções>
        }
    }
    */
    proto.associate = function(associationObj, models){
        if(!_(this).isCommitted){
            throw new Error.InvalidOperationError('can\'t associate without commit the model.');
        }

        for(var k in associationObj){
            // TODO: considerar que pode ser passado um Array dentro de cada Modelo a ser Associado para multiplas associações
            var options = (association[k].options) ? association[k].options : {};
            var association = associationObj[k].association;

            this[association](models[k], options);
        }
    }

    // Setters
    proto.setSchema = function(schema){
        _(this).schema = schema;
    }

    proto.setClassMethods = function(classMethods){
        _(this).classMethods = classMethods
    };

    proto.setHooks = function(hooks){
        _(this).hooks = hooks;
    };

    protosetInstanceMethods = function(instanceMethods){
        _(this).instanceMethods = instanceMethods;
    };

    this.addGetters('schema', 'classMethods', 'instanceMethods', 'hooks');

});

// Export para consign executar e recuperar a variável do ModelConstructor
module.exports = function(){
    return pModelConstructor;
};
