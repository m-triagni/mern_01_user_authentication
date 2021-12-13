# mern_01_user_authentication
Provides user authentication functions using MERN Stack including these use cases :
- User registration & email authentication.
- User login & logout.
- User forget & reset password.

# Quick Start

## 1. Make sure you have AWS account and for non production environment, register email from and email to :
- Prepare 2 email account for email from and email to for email authentication.
- Put the email from and email to in AWS SNS service.

## 2. Update env file at server/.env and modify this content :
- DATABASE_URL : Type your database url.
- AWS_APP_KEY : AWS App Key for SNS email service.
- AWS_SECRET_KEY : AWS Secret Key for SNS email service.
- AWS_REGION : AWS region for SNS email service.
- EMAIL_FROM : Email from for email authentication. Make sure it's registered in AWS SNS for non production environment.
- EMAIL_REPLY_TO : Email to for email authentication. Make sure it's registered in AWS SNS for non production environment.

## 3. Deployment to AWS :
- Create IAM User. 
  Make sure the created IAM user has EC2 & SNS access  (contains AmazonEC2FullAccess , AmazonSESFullAccess in the policy)
- Create EC2 instance.
    - Select Ubuntu instance.
    - Configure security group as follow into your instance :
        - SSH 
        - HTTP with port 80
        - Custom TCP with port 8000 (for server port)
        - Custom TCP with port 3000 (for client port)
- Login into EC2 instance and do these steps :
    - Install nodeJs 
    Use this link to help https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
    - Install dependencies.
- Pull code onto the server from github.
- Start your node application using pm2.
- Configure nginx to make your app run on port 80.

## 4. Run backend/server with following command :
- Go to server folder. 
- Run this command : npm start

## 5. Run frontend/client with following command :
- Go to client folder. 
- Run this command : npm run dev

## 6. Perform this use case :
- Register user and email
- Authenticate email
- Login
- Logout
- Forget password
- Reset password