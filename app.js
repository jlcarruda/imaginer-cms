global.coreRequest = function(name){

    return require(__dirname + '/core/' + name);
}

var server = require('./config/server');
require('colors');

server.then(function(webserv) {
    if(webserv){
        webserv.listen(3000, function(){
            console.log('====== Servidor Up ======'.cyan);
        });
    }
}).caught(e=>{
    console.log(e.message.orange);
    throw e;
});
