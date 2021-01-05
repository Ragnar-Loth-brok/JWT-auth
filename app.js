const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use(cookieParser());
app.use(authRoutes);

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

hbs.registerPartials(`${__dirname}/views/partials`)

mongoose.connect('mongodb://localhost:27017/node-auth', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log('Database Connected'))
.catch((error) => console.log('Connection denied!'))

app.get('*', checkUser);

app.get('/', (req, res) => res.render('home') );

app.get('/profile', requireAuth, (req, res) => res.render('profile') );

app.listen(8000, () => console.log('Listening to the port 8000'));