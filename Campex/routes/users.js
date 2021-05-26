const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
   res.render("users/register.ejs");
});

router.post("/register", async (req, res) => {
   res.send(req.body);
});

module.exports = router;
