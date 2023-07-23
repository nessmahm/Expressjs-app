const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (typeof authHeader !== 'undefined') {
        // Extract the token from the "Bearer <token>" format
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err) {
                // Token verification failed
                return res.sendStatus(403); // Forbidden
            }

            // Token is valid; save the decoded payload for later use if needed
            req.user = decoded;
            next();
        });
    } else {
        // No token provided in the request header
        res.sendStatus(401); // Unauthorized
    }
};
module.exports = verifyToken;
