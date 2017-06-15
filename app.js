global.coreRequest = function(name){

    return require(__dirname + '/' + name);
}

var server = require('./config/server');

server.then(function(webserv) {
    if(webserv){
        webserv.listen(3000, function(){
            console.log('Servidor Up');
        });
    }
}).caught(e=>{
    console.log(e.message);
    throw e;
});
