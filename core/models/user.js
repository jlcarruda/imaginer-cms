module.exports = function(serv){

    // var cUser = serv.core.parents.ModelConstructor.subclass();  // Criar cUser como subclasse do ModelConstructor;
    var sequelize = serv.DAO.getSequelize();
    var db = serv.DAO.getDB();
    console.log(sequelize.UUIDV4);
    var schema = {
        uuid: {
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4
        },
        name: {
            type: sequelize.STRING,
            allowNull: false
        },
        username: {
            type: sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        password: {
            type: sequelize.TEXT,
            allowNull: false
        }
    };

    var model = db.define('User', schema, {
        freezeTableName: true
    });

    return model;

    // var model = new cUser('User', schema);
    //
    // model.define(db);
    //
    // return model;
}
