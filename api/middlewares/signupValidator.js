const {body, validationResult} = require('express-validator');

exports.userValidator = [
    body('email')
        .isEmail()
        .withMessage(() => {
            return { info: "valid email is required", statusCode: 400 }
        })
        .bail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage(() => {
            return { info: "password should be minimum 6 characters", statusCode: 400 }
        })
        .bail(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                statusCode: 422,
                errors: errors.array(),
            });
        }
        next();
    }
]