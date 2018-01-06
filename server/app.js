const express = require('express');
const logger = require('morgan'); 
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 8000;

app.use(logger('dev')); 
app.use(express.json()); 
app.use(express.urlencoded()); 
app.use('/assets', express.static(path.join(__dirname, '..', 'client', 'assets'))); 
app.use(session({ secret: 'wishbone' })); 
app.use(passport.initialize()); 
app.use(passport.session()); 

const {passportMethod, connection} = require('./passport');

passportMethod(passport);
require('./routes/auth.js')(app, passport);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'client', 'index.html'));
});


app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'client', 'signup.html'));
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'client', 'login.html'));
});


app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'client', 'profile.html'));
});



app.post('/action', (req, res) => {
    let output = {
        success: false,
        data: null,
        errors: null
    };

    const query = `CALL handleUserAction(${req.body.id}, '${req.body.action}')`;

    connection.query(query, function(error, data){

        if (!error){
            output.success = true;
            output.data = data[0][0];
        } else {
            output.errors = "there was an error"; // being the mean backend is so fun
        }

        res.send(output);
    });
});



function errorHandler (err, req, res, next) { 
	if (res.headersSent) {
	  return next(err);
	}
	res.status(500);
	res.send('Error, something broke!');
}

app.listen(PORT, () => {
    console.log("Let's find some ghosts on port: ", PORT);
});

