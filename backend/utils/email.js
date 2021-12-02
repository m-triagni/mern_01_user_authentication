const { listPage } = require('../listPage')

exports.emailVerificationParams = (email, token) => {
    //create params for email verification
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_REPLY_TO],
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: "Email verification",
            },
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: ` <html>
                                <h1 style="color:black;"> Verify your email address ${email}</h1>
                                <p>Please use the following link to complete your registration: </p>
                                <p>${process.env.CLIENT_URL}${listPage.Page_Activation}/${token}</p>
                            </html>`,
                }
            }
        }
    }

}


exports.emailForgetPasswordParams = (email, token) => {
    //create params for email verification
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_REPLY_TO],
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: "Reset password link",
            },
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: ` <html>
                                <h1 style="color:black;">Reset your password</h1>
                                <p>You have requested to reset password. Please use the following link to reset your password: </p>
                                <p>${process.env.CLIENT_URL}${listPage.Page_PasswordReset}/${token}</p>
                            </html>`,
                }
            }
        }
    }

}