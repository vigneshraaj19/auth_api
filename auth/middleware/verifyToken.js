const jwt = require("jsonwebtoken");
const { promisify } = require("util");

//   check if token exists
//   if not token send res
//   decode the token
//   if valid next
 

module.exports = async (req, res, next) => {
  try {
    
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({
        status: "fail",
        error: "You are not logged in",
      })
    }


    const decoded = await promisify(jwt.verify)(token, "vigneshraaj")

    req.user = decoded

    next()
  } catch (error) {
    res.status(403).json({
      status: "fail",
      error: "Invalid token"
    });
  }
};