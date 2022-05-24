const Employee = require('../models/employee');
jwt = require('jsonwebtoken');
const jwtAuth = require('../middlewares/jwtAuth');

module.exports = {
    /* verifyJWT: async (req, res, next) => {
        const authHeader = await req.headers.authorization;
        if (!authHeader) {
          return res.status(401).send({ message: 'UnAuthorized access' });
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
          if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
          }
          req.decoded = decoded;
          next();
        });
      }, */
    
    isAdmin: async (req , res, next) => {  
        const requester = req.decoded ? req.decoded.id : undefined;
        console.log(req.decoded);
        const requesterAccount = await Employee.findOne({_id: requester});
        if (requesterAccount.role === 'admin'){
            next();
        }
        else {
            res.status(403).json({message: 'unauthorized'});
        }
    }
}