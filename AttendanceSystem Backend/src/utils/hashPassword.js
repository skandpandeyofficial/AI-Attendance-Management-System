const bcrypt = require("bcrypt");



// convert password to hash
const hashPassword = async (password) => {
  saltRound = 10;

  return await bcrypt.hash(password, saltRound);
};




// compare password; plain password with Hash Password
const comparePassword = async (password,hashPassword) => {

    return await bcrypt.compare(password,hashPassword);
    
};



module.exports = { hashPassword, comparePassword };
