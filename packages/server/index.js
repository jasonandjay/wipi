const bcrypt = require('bcryptjs'); 

let password = bcrypt.hashSync('admin', 10);
console.log('password...', password);