var exported = function(){}


exported.prototype.encrypt = encrypt;

function encrypt(app, text){
   const crypto = require('crypto');
   var configs = app.servConfig.crypto;

   var hash = crypto.pbkdf2(text, configs.default_salt, 10000);
   return hash;
}

exported.prototype.compare = compare;
function compare(app, salt, hash, attempt){
    const crypto = require('crypto');

    return hash == crypto.pbkdf2(attempt, salt, 10000);
}


module.exports = exported;
