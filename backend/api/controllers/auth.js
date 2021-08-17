const User = require("../models/user");
const {check, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req,res)=>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            return res.status(400).json({err: "User Not Saved"})
        }
        res.json({
            user: user.name,
            email: user.name,
            id: user._id
        });
    })
};

exports.signin = (req,res)=>{
    const {email, password } = req.body;
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    User.findOne({email}, (err, user) => {
        if(err || !user){
            res.status(400).json({
                error: "User Not Found"
            });
        }
        if(!user.autheticate(password)){
            return res.status(401).json({
                error: "Email and Password do not match"
            });
        }

        // create token
        const token = jwt.sign({_id: user._id}, "qwehdkss")
        res.cookie("token", token, {expire :  new Date() +9999});

        // send resonse to front end
        const {_id, name, email, role} = user;
        return res.json({ token, user: {_id, name, email, role}});
    });

};


exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        message: "user signout"
    });
};

// protect routes
exports.isSignedIn  = expressJwt({
    secret: "qwehdkss",
    algorithms: ['sha1', 'RS256', 'HS256'],
    userProperty: "auth"
});

// middelwares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker) {
        return res.status(403).json({
            error: "access denied"
        });
    }
    next();
};
exports.isAdmin = (req, res, next) =>{
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: "you are not admin"
        });
    }
    next();
};