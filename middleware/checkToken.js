const {verifyToken} = require('../services/authentication')


function authenticateAndCheckCookieValue(cookieName){
   return (req,res,next) => {
      const cookieValue = req.cookies[cookieName]
      if(!cookieValue){
         return res.render("home",{
            user: null,
             message: "Please Login",
            success: false
         })
      }
  
      const userPayload = verifyToken(cookieValue);
      if(!userPayload){
         return res.render("home", {
            user: null,
            message: "Please Login",
            success: false
         });
      }
      req.user = userPayload
      next();

   }
}

module.exports = {authenticateAndCheckCookieValue}