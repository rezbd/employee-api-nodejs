const jwt = require('jsonwebtoken');

module.exports = {
    verifyJWT: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).send({ message: 'UnAuthorized access. Need to login' });
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
          if (err) {
            return res.status(403).send({ message: 'Forbidden access. Token is not valid' })
          }
          req.decoded = decoded;
          next();
        });
      }
}