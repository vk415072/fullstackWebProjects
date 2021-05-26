module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      // returning to the requested URL asked before login/register to session
      req.session.returnTo = req.originalUrl
      
      req.flash("error", "you must be signed in first!");
      return res.redirect("/login");
   }
   next();
};
