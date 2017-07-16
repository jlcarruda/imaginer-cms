var Promise = require('bluebird');

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
        res.render('adminLogin', {viewConfig: viewConfig});
    });


    // Registra a rota para validação do formulário
    serv.post('/admin/validate', function(req, res){
        var data = req.body;
        //TODO: Recebe os dados e trata-os no controller "cAdmin.js"
        controller.authenticate(req).then(function(user){
            if(user){
                console.log('USUARIO LOGADO', user.ID);
                // res.render('adminDashboard');
            }
        });
        res.send(data);
    });


    // função de criação de usuário para Desenvolvimento

    serv.get('/admin/create_user', function(req, res){
        controller.create_user(req).then(function(user){
            if(user) {
                console.log()
                // console.log(user);
                console.log()
            }
        })
    });

}
