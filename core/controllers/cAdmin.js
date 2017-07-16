
module.exports = function(models){
    this.models = models;

    this.authenticate = function (req){
        var User = this.models.user;
        console.log(User);
        return User.findOne({
            where: {
                username: req.body.user,
                password: req.body.password
            }
        });
    }

    this.create_user = function (req){
        var User = this.models.user;
        console.log('User', User);
        return User.create({
            name: 'admin',
            username: 'admin',
            password: 'admin',
        })
        console.log('\n Usuario Criado \n');
    }

    return this;
}
