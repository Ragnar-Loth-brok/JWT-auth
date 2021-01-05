const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { create } = require('../models/User');

const maxAge = 24*60*60;

const handleError = err => {
    let errors = {username: null, email: null, password: null, gender: null};

    if(err.message === 'Incorrect email') {
        errors.email = 'Email does not exist!'
    }

    if(err.message === 'Incorrect password') {
        errors.password = err.message;
    }


    if (err.code === 11000) {
        const type = err.message.includes('username') ? 'username' : 'email'; 
        errors[type] = `${type} already registered!`;
    }  

    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach( ({properties}) => errors[properties.path] = properties.message )
    }

    return errors;
}

const createToken = id => {
    return jwt.sign({ id }, 'my secret code : qwertyuioplkjhgfdsazxcvbnm', {
        expiresIn : maxAge
    });
}

module.exports.register_get = (req, res) => {
    res.render('register')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.register_post = async (req, res) => {
    const { username, email, password, gender } = req.body;
    
    try {
        const user = await User.create({ username, email, password, gender });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});

        res.status(201).json({ user: user._id});

        console.log(`New user -> ${user} added to the database`);
    } catch (error) {
        const errors = handleError(error);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);      
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

        res.status(200).json({ user: user._id});
        
        console.log(`User -> ${user} just logged in..`);
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1});
    res.redirect('/');
}