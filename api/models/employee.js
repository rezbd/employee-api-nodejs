const mongoose = require('mongoose');
const crypto = require('crypto');

const employeeSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false
    },
    designation: {
        type: String
    },
    hash: String,
    salt: String
}, { timestamps: true })


// Method to set salt and hash the password for a user
// setPassword method first creates a salt unique for every user
// then it hashes the salt with user password and creates a hash
// this hash is stored in the database as user password
employeeSchema.methods.setPassword = function(password) {     
    // Creating a unique salt for a particular user
       this.salt = crypto.randomBytes(16).toString('hex');
     
       // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
       this.hash = crypto.pbkdf2Sync(password, this.salt, 
       1000, 64, `sha512`).toString(`hex`);
   };


// Method to check the entered password is correct or not
// valid password method checks whether the user
// password is correct or not
// It takes the user password from the request 
// and salt from user database entry
// It then hashes user password and salt
// then checks if this generated hash is equal
// to user's hash in the database or not
// If the user's hash is equal to generated hash 
// then the password is correct otherwise not
employeeSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, 
    this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};


module.exports = mongoose.model('Employee', employeeSchema, 'employee-info');