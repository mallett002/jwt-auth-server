const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('./database');
const {JWT_SECRET} = require('./constants');
const jwtAuth = require('./jwtAuth');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => res.json('Howdy'));

app.get('/persons', jwtAuth, (req, res) => {
    res.json(db);
});

app.post('/persons', jwtAuth, (req, res) => {
    const person = req.body;
    const personId = Object.keys(db).length + 1;

    db[personId] = person;
    
    res.status(201).send({message: `created person with id ${personId}`});
});

app.get('/persons/:id', (req, res) => {
    const person = db[req.params.id];

    res.json({person});
});

app.post('/authenticate', (req, res) => {
    const user = req.body;
    const options = {
        subject: user.email,
        expiresIn: '3s'
    };

    try {
        const token = jwt.sign({user}, JWT_SECRET, options);

        res.json({token});
    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(3000, () => console.log('server listening on port 3000'));