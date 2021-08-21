const express  = require('express')
const router = express.Router()
const {check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth")

router.post("/signup", [
    check("name","name Should be at least 3 char long").isLength({ min: 3}),
    check("email", "email is req").isEmail(),
    check("password", "pass should be least 3 char long").isLength({ min: 3})
], 
signup);

router.post("/signin", [
    check("email", "email is req").isEmail(),
    check("password", "pass field is Req").isLength({ min: 3})
], 
signin);

router.get("/signout", signout)

router.get("/testroute" ,isSignedIn, (req, res) => {
    res.json(req.auth);
});

module.exports = router