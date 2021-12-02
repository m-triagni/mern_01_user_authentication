const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

const { listAPI } = require('./listAPI')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// apply middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//set cors
//if API allowed for all
//app.use(cors())
app.use(cors({ origin: process.env.CLIENT_URL }))

//set DB
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true  })
.then( () => console.log('DB is connected'))
.catch( err => console.log(err) )

//set routes
app.use(listAPI.API, authRoutes);
app.use(listAPI.API, userRoutes);

// start open the port to listen
const port = process.env.PORT ;
app.listen(port, () => console.log(`API is running on port ${port}.`));