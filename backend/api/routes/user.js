const express  = require('express')
const router = express.Router()
const User = require("../models/user");

const {updateUser, getUserById, getUser, getAllUsers, userPurchasedList } = require("../controllers/user")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// router.get("/users",getAllUsers);

router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.put("/user/orders/:userId", isSignedIn, isAuthenticated, updateUser, userPurchasedList);


module.exports = router;