const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('./database');
const {JWT_SECRET} = require('./constants');
const jwtAuth = require('./jwtAuth');
const randToken = require('rand-token');
const refreshTokens = {};

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => res.json('Howdy'));

app.get('/persons', jwtAuth, (req, res) => {
    res.json(db.persons);
});

app.post('/persons', jwtAuth, (req, res) => {
    const person = req.body;
    const personId = Object.keys(db).length + 1;

    db.persons[personId] = person;
    
    res.status(201).send({message: `created person with id ${personId}`});
});

app.get('/persons/:id', (req, res) => {
    const person = db.persons[req.params.id];

    res.json({person});
});

app.post('/authenticate', (req, res) => {
    const user = req.body;

    if (user.email in db.users) {
        const options = {
            subject: user.email,
            expiresIn: '15m'
        };

        try {
            const token = jwt.sign({email: user.email}, JWT_SECRET, options);
            const refreshToken = randToken.uid(256);
    
            refreshTokens[user.email] = refreshToken;
    
            return res.json({
                jwtToken: token,
                refreshToken
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    res.status(404).json(`User with email ${user.email} does not exist`);
});

app.post('/token', (req, res) => {
    const {email, refreshToken} = req.body;

    if (refreshTokens[email] === refreshToken) {
        const options = {
            subject: email,
            expiresIn: '15m'
        };

        try {
            const token = jwt.sign({email}, JWT_SECRET, options);

            return res.json({
                jwtToken: token
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    res.status(404).json(`User with email ${req.body.email} does not exist`);
});

app.listen(3000, () => console.log('server listening on port 3000'));