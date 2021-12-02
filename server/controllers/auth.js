const AWS = require('aws-sdk')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const shortId = require('shortid')
const expressJwt = require('express-jwt')
const lodash = require('lodash');

const {emailVerificationParams, emailForgetPasswordParams} = require('../utils/email')
const {listEnum} = require('../listEnum')

require('dotenv').config();

//------------------------------------------
// AWS to send email
//------------------------------------------

AWS.config.update({
    accessKeyId: process.env.AWS_APP_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({
    apiVersion: '2010-12-01',
});

exports.register = (req, res) => {
    const{name, email, password} = req.body;

    //check if user exists in our db
    User.findOne({email}).exec((err, user) => {

        //if exists, return error
        if (user) { 
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        //if not exits, generate token with user name, email and password
        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: process.env.JWT_EXPIRED
        });

        //create params for email verification
        const emailVerificationParam = emailVerificationParams(email, token)
        const sendEmailOnRegister = ses.sendEmail(emailVerificationParam).promise();

        sendEmailOnRegister
        .then( data => {
            console.log('Email is submitted: ', data)
            res.json({ message: `Email has been sent to ${email}. Follow the instructions to complete your registration`  });
        })
        .catch( error => {
            console.log('Submit email error: ', error)
            res.status(422).json({ error: `We could not verify your email ${email}. Please try again` });
        })
    })

    

};

exports.registerActivate = (req, res) => {
    const {token} = req.body;
  
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (error, decodedMsg) => {
        console.log(error)
        if(error) {
            return res.status(process.env.APPLICATION_ERROR_CODE).json({
                error: 'Expired link. Try again'
            })
        }
        
        const {name, email, password} = jwt.decode(token)

        const username = shortId.generate();

        User.findOne({email}).exec((err, user) => {

            //user is exists
            if(user) {
                return res.status(401).json({
                    error: 'Email is already taken'
                })
            }

            //create new user
            const newUser = new User({ username, name, email, password })
            newUser.save((err, result) => {
                if(err) {
                    return res.status(401).json({
                        error: 'Unable to save your data. Try again.'
                    })
                }

                //save successfully
                return res.json({
                    message: 'Registration success. Please login.'
                })
            })
        })

    })
};

exports.login = (req, res) => {
    const {email, password} = req.body;
    console.table({email, password});

    User.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return res.status(process.env.APPLICATION_ERROR_CODE).json({
                error: "User with that email doesn't exists. Please register."
            })
        }
        //authenticate
        if(!user.authenticate(password)) {
            return res.status(process.env.APPLICATION_ERROR_CODE).json({
                error: "Password isn't match. Please try again."
            })
        }

        //generate token and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        const {_id, name, email, role} = user;

        return res.json({
            token, user: {_id, name, email, role}
        }) 

    } )
};

exports.requireSignIn = expressJwt({secret: process.env.JWT_SECRET});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;

    User.findOne({_id: authUserId}).exec((err, user) => {
        if (err || !user) {
            return res.status(process.env.APPLICATION_ERROR_CODE).json({
                error: 'User is not found'
            })
        }

        req.profile = user;

        next();
    })
}

exports.adminMiddleware = (req, res, next) => {
    const authAdminId = req.user._id;

    User.findOne({_id: authAdminId}).exec((err, user) => {
        if (err || !user) {
            return res.status(process.env.APPLICATION_ERROR_CODE).json({
                error: 'User is not found'
            })
        }
 
        if (user.role !== listEnum.user.role.admin) {
            return res.status(process.env.APPLICATION_ERROR_CODE).json({
                error: 'Admin resource. Access is denied.'
            })
        }

        req.profile = user;

        next();
    })
}

exports.forgetPassword = (req, res) => {
 
    const {email} = req.body;
 
    //check if user exists with that email
    User.findOne({email}).exec((err, user) => {
        if(err || !user) {
            return res.status(process.env.APPLICATION_ERROR_CODE).json({
                error: 'User with that email does not exists'
            })
        }

        //generate token
        const token = jwt.sign({name: user.name}, process.env.JWT_RESET_PASSWORD, {expiresIn: '60m'})
    
        //create email
        const params = emailForgetPasswordParams(email, token);

        //update DB resetPasswordLink with token
        return user.updateOne({resetPasswordLink: token}, (err, success) => {
            if(err) {
                return res.status(process.env.APPLICATION_ERROR_CODE).json({
                    error: 'Reset password is failed. Try later.'
                })
            }

            const sendEmail = ses.sendEmail(params).promise()

            sendEmail
            .then(data => {
                return res.json({
                    message: `Email has been sent to ${email}. Click on the link to reset password`
                })
            })
            .catch(error => {
                return res.status(APPLICATION_ERROR_CODE).json({
                    error: `We could not send reset password link to your email. Please try again later`
                })
            })
        })
    })
}

exports.resetPassword = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body;
 
    if(resetPasswordLink) {

        //validate token
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decodedMsg) => {
            if(err) {
                return res.status(process.env.APPLICATION_ERROR_CODE).json({
                    error: 'Token is expired. Try again later.'
                })
            }
        });

        //check if token is exists
        User.findOne({resetPasswordLink}).exec((err, user) => {
            if(err || !user) {
                return res.status(process.env.APPLICATION_ERROR_CODE).json({
                    error: 'Password reset failed. Try again later.'
                })
            }

            console.log('newPassword: ', newPassword)

            //update new password
            const updatedField = {
                password: newPassword,
                resetPasswordLink: '',
            }
            
            //updated user
            user = lodash.extend(user, updatedField );

            user.save((err, result) => {
                console.log('err: ', err)
                if(err) {
                    return res.status(APPLICATION_ERROR_CODE).json({
                        error: 'Saving your new password is failed. Try again later.'
                    })
                }

                console.log('result: ', result)


                return res.json({
                    message: 'Reset password is success.'
                })
            })
        })
    }
}