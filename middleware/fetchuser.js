var jwt = require('jsonwebtoken');
const JWT_SECRET = "aksfnkjasnnfansn"

const fetchuser = (req, res, next)=>{

    // Get user from token and add id to req object

    const token = req.header('auth-token');

    if(!token){
        res.status(401).json({error : "Access denied "});
    }

    try {
        // Verifying Token ans retrieve data from db by token
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).json({error : "Access denied "});
    }

}

module.exports = fetchuser;

