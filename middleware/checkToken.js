const { verifyToken } = require('../services/authentication')


function authenticateAndCheckCookieValue(cookieName) {
   return (req, res, next) => {
      try {
         const cookieValue = req.cookies[cookieName]
         if (!cookieValue) {
            return res.redirect("/users/signin");
         }

         const userPayload = verifyToken(cookieValue);
         if (!userPayload) {
            return res.redirect("/");
         }
         req.user = userPayload
         next();

      } catch (err) {
         console.log("Error in Authentication MiddleWare", err)
      }


   }
}

module.exports = { authenticateAndCheckCookieValue }