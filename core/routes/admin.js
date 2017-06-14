var Promise = require('bluebird');


module.exports = function(serv){

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
        res.send(data);
    })
}
