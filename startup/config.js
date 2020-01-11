const config = require('config');
const debug = require('debug')('app:starting');

module.exports = function() {
    // Configuration
    debug('Application name : ' + config.get('name'));
    debug('Mail Server : ' + config.get('mail.host'));
    //get the pass from environment variable for the mail server password
    // debug('Mail Password : ' + config.get('mail.password'));
        
    
    // proche_jwtPrivateKey=hhhhhhh node app.js

    // set proche_jwtPrivateKey=mySecureKey
    if (!config.get('jwtPrivateKey')) {
        console.error('Fatal error the jwtPrivateKey is not defined');
        process.exit(1);
        // 0 means success
        // anything beside 0 is failure
    }

}