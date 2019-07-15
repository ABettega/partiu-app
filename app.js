require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser'); 
const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash      = require("connect-flash");
const config = require('./config/passport');

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongoDB');
});

app.use(morgan('dev'));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'partiu-app',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}))
app.use(flash());
app.use(config.initialize());
app.use(config.session());

const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const interesseRoutes = require('./routes/interesse');
app.use('/interesse', interesseRoutes);

app.listen(process.env.PORT, () => console.log(`server is running on port ${process.env.PORT}`));
