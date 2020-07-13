const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('./database');
const {JWT_SECRET} = require('./constants');
const {validateJwt} = require('./jwtAuth');
const randToken = require('rand-token');
const refreshTokens = {};

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => res.json('Howdy'));

app.get('/persons', validateJwt, (req, res) => {
    res.json(db.persons);
});

app.post('/persons', validateJwt, (req, res) => {
    const person = req.body;
    const personId = Object.keys(db).length + 1;

    db.persons[personId] = person;
    
    res.status(201).send({message: `created person with id ${personId}`});
});

app.get('/persons/:id', validateJwt, (req, res) => {
    const person = db.persons[req.params.id];

    res.json({person});
});

app.post('/authenticate', (req, res) => {
    const payloadUser = req.body;

    if (payloadUser.email in db.users) {
        const dbUser = db.users[payloadUser.email];

        if (payloadUser.password !== dbUser.password) {
            return res.status(401).json('Invalid credentials');
        }

        const jwtOptions = {
            subject: payloadUser.email,
            expiresIn: '5m'
        };

        try {
            const token = jwt.sign({name: dbUser.name}, JWT_SECRET, jwtOptions);
            const refreshToken = randToken.uid(256);
    
            refreshTokens[payloadUser.email] = refreshToken;
    
            return res.json({
                accessToken: token,
                refreshToken
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    res.status(404).json(`User with email ${payloadUser.email} does not exist`);
});

app.post('/token', (req, res) => {
    const {email, refreshToken} = req.body;

    if (refreshTokens[email] === refreshToken) {
        const {name} = db.users[email];
        const jwtOptions = {
            subject: email,
            expiresIn: '15m'
        };

        try {
            const token = jwt.sign({name}, JWT_SECRET, jwtOptions);

            return res.json({
                accessToken: token
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    res.status(404).json(`User with email ${req.body.email} does not exist`);
});

app.listen(3000, () => console.log('server listening on port 3000'));