const User = require("../models/user");

module.exports.registerPage = (req, res) => {
   res.render("users/register.ejs");
};

module.exports.registerUser = async (req, res, next) => {
   try {
      const { email, username, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      // logging in the registered user after the registration
      req.login(registeredUser, (err) => {
         if (err) {
            return next(err);
         }
         req.flash("success", "Welcome to Campex!");
         res.redirect("/campgrounds");
      });
   } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
   }
};

module.exports.loginPage = (req, res) => {
   res.render("users/login");
};

module.exports.loginUser = (req, res) => {
   req.flash("success", "Welcome back!");
   // using returning to requested URL asked before login/register (defined in userMiddleware.js)
   // or '/campgrounds' because what is user didn't asked for any URL before login/register
   const requestedUrl = req.session.returnTo || "/campgrounds";
   // also we need to delete that requested URl that is saved in the db
   delete req.session.returnTo;
   res.redirect(requestedUrl);
};

module.exports.logoutUser = (req, res) => {
   req.logout();
   req.flash("success", "You have been logged out!");
   res.redirect("/campgrounds");
};
