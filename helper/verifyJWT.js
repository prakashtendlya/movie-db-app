const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("auth-token");
    if(!token) {
        return res.status(400).send("Access denied!");
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verified)
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send({message:"Invalid token"});
    }
}