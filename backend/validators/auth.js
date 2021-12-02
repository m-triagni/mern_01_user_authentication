const {check} = require('express-validator')

exports.registrationValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('email') 
        .isEmail()
        .withMessage('Email must be a valid email address'),  
    check('password') 
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),      
]

exports.userLoginValidator = [
    check('email') 
        .isEmail()
        .withMessage('Email must be a valid email address'),  
    check('password') 
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),      
]

exports.forgetPasswordValidator = [ 
    check('email') 
        .isEmail()
        .withMessage('Must be a valid email address'),         
]

exports.resetPasswordValidator = [ 
    check('newPassword') 
        .not()
        .isEmpty()
        .withMessage('Token is required'),   
]
