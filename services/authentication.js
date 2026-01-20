const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET


function generateToken(payload){
    return jwt.sign(payload, secretKey);
}

function verifyToken(token){
    try{
        return jwt.verify(token, secretKey);
    }catch(err){
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken
}