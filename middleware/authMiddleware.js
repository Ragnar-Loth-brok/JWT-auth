const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    if(token) {
        
        jwt.verify(token, 'my secret code : qwertyuioplkjhgfdsazxcvbnm', (err, decodedToken) => {
            if (err) res.redirect('/login')
            else next();
        })

    }
    else res.redirect('/login');
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, 'my secret code : qwertyuioplkjhgfdsazxcvbnm', async (err, decodedToken) => {
            if(err) {
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findById(decodedToken.id);
                
                let gender = false;
                if(user.gender === 'Male') gender = true;
                else gender = false;
                
                res.locals.user = user;
                res.locals.gender = gender;
                next();
            }
        })
    }else {
        res.locals.user = null;
        next();
    }
}


module.exports = { requireAuth, checkUser };