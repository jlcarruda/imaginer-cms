module.exports = function(serv){

    var cUser = serv.core.parents.ModelConstructor.subclass();  // Criar cUser como subclasse do ModelConstructor
    var sequelize = serv.DAO.getSequelize();
    var db = serv.DAO.getDB();

    var schema = {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
            type: sequelize.STRING,
            allowNull: false
        }
    };

    var model = new cUser('User', schema);

    model.define(db);

    console.log(model.setSchema);

    return model;
}
