module.exports = function(serv){

    var viewConfig = {
        cssFile: 'admin_login',
        title: 'Login'
    };
    // Registra a rota do servidor
    serv.get('/admin', function(req, res){
        res.render('admin_login', {viewConfig: viewConfig});
    });


}
