var Promise = require('bluebird');
var colors = require('colors');
module.exports = function(serv){

    var controller = coreRequest('controllers/cAdmin.js')(serv.core.models);
    // console.log(controller);
    var viewConfig = {
        cssFile: 'admin',
        title: 'Login'
    };

    // Registra a rota de login do servidor
    serv.get('/admin', function(req, res){
        //TODO: Se não com sessão aberta, vai para Login. Se sim, vai para dashboard
        if(req.session.user){

            console.log(colors.cyan('Logged User: %s'), req.session.user.username);

            res.render('adminDashboard', {viewConfig: {  // Renderiza pagina de dashboard para o admin
                title: 'Dashboard'
            }, userData: req.session.user});

        } else {
            var configObj = {viewConfig: viewConfig, err: {
                unauthorized : false
            }};
            

            if(res.app.errors){
                delete res.locals.nonAuthorized;
                configObj.err.unauthorized = true;
            }
            res.render('adminLogin', configObj);
        }
    });


    // Registra a rota para validação do formulário
    serv.post('/admin/validate', function(req, res){
        var data = req.body;
        controller.authenticate(req, res);
        // res.send(data);
    });

    serv.get('/admin/logout', function(req, res){
        controller.logout(req, res);
    });

}
