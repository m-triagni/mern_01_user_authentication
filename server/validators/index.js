const {validationResult} = require('express-validator');

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(process.env.APPLICATION_ERROR_CODE).json({
            error:errors.array()[0].msg
        })
    };

    next();
}