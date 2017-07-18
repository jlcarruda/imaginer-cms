var Crypto = require('crypto');
var Errors = require('common-errors');
var colors = require('colors');
module.exports = function(models){
    this.models = models;

    this.authenticate = function (req, res){
        var User = this.models.user;
        var cryptoConfig = req.app.servConfig.crypto;
        
        User.findOne({
            where: {
                username: req.body.user,
                password: req.app.encrypt(req.body.password, cryptoConfig.default_salt).toString('hex')
            }
        }).then(function(user){
            if (user){
                req.session.user = user;
                req.session.save(function(err){
                    if(err){
                        throw new Errors('Error while saving session', err.message)
                    } else {
                        // Renderiza a página de dashboard pro admin
                        res.redirect('/admin');
                        res.render('adminDashboard', {viewConfig: {
                            title: 'Dashboard'
                        }, userData: user});
                    }
                });
            } else {
                res.app.errors.unauthorized = true;
                res.redirect('/admin');
            }

        }).catch(function(err){
            throw err;
        });
    }

    this.logout = function(req, res) {
        req.session.destroy(function(err){
            if(err){
                throw new Errors('Error while logging out from administration', err.message);
            } else {
                res.redirect('/admin');
            }
        })
    }
    return this;
}
