const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./constants');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (authHeader) {
        try {
            const [, token] = authHeader.split(' ');

            jwt.verify(token, JWT_SECRET);

            return next();
        } catch (err) {
            return res.status(403).json(err);
        }
    }

    res.status(403).json({message: 'No auth header'});
};