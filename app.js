const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');



const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);
// db config
const db = require('./config/database');


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURL, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
// End mongoose



/** Handlebars Middleware **/
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static folder - path
app.use(express.static(path.join(__dirname, 'public')));


// Method override middleware 
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware - important to be after session middleware
app.use(passport.initialize());
app.use(passport.session());

// Flas middleware
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
/** End middleware */


/** ROUTES **/
// Index Route
app.get('/', function (req, res) {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
})

// About Route
app.get('/about', function (req, res) {
    res.render('about');
})
/** End Routes **/


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);
// End using routes


// Server
const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Port is listening on ${port}`) });
// End Server