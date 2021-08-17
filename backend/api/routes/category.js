const express = require("express")
const router = express.Router()

const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category")
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

// Params
router.param("userId" , getUserById);
router.param("categoryId" , getCategoryById);

// actual routes

router.post(
    "/category/create/:userId",
    isSignedIn,
    isAuthenticated, 
    isAdmin, 
    createCategory
);

router.get("/category/:categoryId" , getCategory);
router.get("/categories" , getAllCategory);

router.put(
    "/category/edit/:categoryId/:userId",
    isSignedIn,
    isAuthenticated, 
    isAdmin, 
    updateCategory
);

router.delete(
    "/category/del/:categoryId/:userId",
    isSignedIn,
    isAuthenticated, 
    isAdmin, 
    removeCategory
);

module.exports = router;