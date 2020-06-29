const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./constants');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (authHeader) {
        try {
            const [, token] = authHeader.split(' ');

            jwt.verify(token, JWT_SECRET);

            next();
        } catch (err) {
            res.status(403).json(err);
        }
    } else {
        res.status(403).json({message: 'No auth header'});
    }
};