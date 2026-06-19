const jwt = require("jsonwebtoken");

// token gen fuction
const generateToken = (user) =>{

    const payload = {name:user.name,email:user.email};
    const secret = process.env.JWT_SECRET;
    const options = {expiresIn:"1d"}


    return jwt.sign(payload,secret,options);
}


// token verify fuction
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Please Login Account",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // decoded data request me attach kar diya

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};



module.exports = {generateToken, verifyToken };