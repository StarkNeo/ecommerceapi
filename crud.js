const { Client } = require('pg');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtClave = process.env.JWT;

//DB POSTGRES CONNECTION
const client = new Client(
    {
        user: dotenv.parsed.USER,
        host: dotenv.parsed.HOST,
        database: dotenv.parsed.DB,
        password: dotenv.parsed.PASSWORD,
        port: dotenv.parsed.PGPORT
    }

);

client.connect(async (err) => {
    try {
        console.log('DB connection established')

    } catch (error) {
        console.log(err)
    }

});


//(async ()=> console.log(await client.query('SELECT NOW()')))(); ES INTERESANTE REVISAR ESTA SINTAXIS

const hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(dotenv.parsed.SALT);
    let hash = await bcrypt.hash(password, salt);
    return hash;
}
const registerUser = async (user) => {
    const passwordHashed = await hashPassword(user.password)
    let values = [user.last_name, user.first_name, user.address, user.phone_number, user.email, user.user_name, passwordHashed, 'user']
    client.query('INSERT INTO users VALUES(DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8)', values)
    return "Record created";
}
const findUser = async (user) => {
    try {
        let isUser = await client.query(`SELECT * FROM users WHERE user_name =$1 AND email = $2`, [user.user_name, user.email]);
        if (isUser.rows.length === 1) {
            return "User already exists";
        } else {
            let createUser = await registerUser(user)
            return createUser;
        }


    } catch (error) {
        console.log(error);
    }

}

//If user is authenticated, generate token and send it to user
const authenticateUser = async (user_name, password) => {
    try {
        let isUser = await client.query(`SELECT * FROM users WHERE user_name =$1`, [user_name]);
        if (isUser.rows.length === 1) {
            let matchedPassword = await bcrypt.compare(password, isUser.rows[0].password);
            let token = await matchedPassword ? generateToken(user_name, password) : "Authenticate Failed";
            return token;
        };

    } catch (error) {
        console.log(error);
    };
}

const generateToken=async (user, password)=>{
    let token = await jwt.sign({user, password},jwtClave);
    console.log(token);
    return token;
}
//Validate all requests to API
const verifyToken = async (req, res) => {
    const bearerHeader = req.headers.authorization;
 
        if (bearerHeader) {
            //EXTRAEMOS EL TOKEN Y LO VALIDAMOS Authorization: Bearer <token>
            let token = bearerHeader.split(" ")[1]; //['BEARER',  '{TOKEN}']
            let validacion = jwt.verify(token, jwtClave,(error, data) => {
                return error ? "invalid user" : req.user = data;    
            });
            console.log(validacion);
            return validacion === "invalid user" ? res.status(401).send({ error: "usuario no autorizado" }): next() 
            
        } else {
            res.sendStatus(403);
        }
    }

module.exports = { findUser, authenticateUser }