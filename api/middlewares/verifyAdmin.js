const Employee = require('../models/employee');
jwt = require('jsonwebtoken');

module.exports = {    
    isAdmin: async (req , res, next) => {  
        const requester = req.decoded ? req.decoded.id : undefined;
        const requesterAccount = await Employee.findOne({_id: requester});
        if (requesterAccount.role === 'admin'){
            next();
        }
        else {
            res.status(403).json({message: 'unauthorized. only for admins'});
        }
    }
}