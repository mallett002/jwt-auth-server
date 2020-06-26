const express = require('express');
const bodyParser = require('body-parser')
const db = require('./database');

const app = express();

// middlewares
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => res.json('Welcome to the auth server'));

app.get('/persons', (req, res) => {
    res.json(db);
});

app.post('/persons', (req, res) => {
    const person = req.body;
    const personId = Object.keys(db).length + 1;

    db[personId] = person;
    
    res.status(201).send({message: `created person with id ${personId}`});
});

app.get('/persons/:id', (req, res) => {
    const person = db[req.params.id];

    res.json({person});
});

app.listen(3000, () => console.log('server listening on port 3000'));