const withCSS = require('@zeit/next-css')
module.exports = withCSS({
    publicRuntimeConfig: {
        APP_NAME: 'FRONTEND-LOGIN',
        API: 'http://localhost:8009/api',
        PRODUCTION: false,
        DOMAIN: 'http://localhost:3000',
        FB_APP_ID : 'gfgsdfgdf'
    }
});
