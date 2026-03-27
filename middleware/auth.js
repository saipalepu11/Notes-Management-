const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    try {
         
        //  const authHeader = req.header("Authorization");
        
        const token = req.cookies.token;
         if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }      
        
        
        const decoded = jwt.verify(token, "jwtkey");
        req.user = decoded.user;
        
        next();
    } catch (err) 
    {
        
        return res.status(401).json({ msg: "Token is not valid" });
    }
};
