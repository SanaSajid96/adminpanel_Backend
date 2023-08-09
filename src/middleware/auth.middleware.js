const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRETKEY;
 // Replace with your JWT secret or private key

const auth = (req, res, next) => {
  const token = req.header('Authorization').split('').splice(7).join('');

  if (!token) {
    // No token provided
    return res.status(401).json({ error: 'No token provided' });
  }

  else {
    // Verify the token
   jwt.verify(token, secret,(err,decoded)=>{
        if(err){
            return null;
        }
        if(decoded.role == 'admin' || decoded.role == 'HR'){
        next()
        }
        else{
            res.status(405).json("you are not authorized to create")
        }
    });

    // Attach the user information to the request object
   
}
};

module.exports = auth;
