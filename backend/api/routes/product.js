const express = require("express")
const router = express.Router()

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const { getProductById, createProduct, getAllProducts, getProduct, getPhoto, updateProduct, deleteProduct, getAllUniqueCategory } = require("../controllers/product")
const { getUserById } = require("../controllers/user")
const { getCategoryById } = require("../controllers/category")

// all param
router.param("userId", getUserById)
router.param("productId", getProductById)
router.param("categoryId" , getCategoryById);

// All Routers
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", getPhoto)
router.get("/product/list", getAllProducts)
router.get("/product/categories/", getAllUniqueCategory)
router.put("/product/update/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)
router.delete("/product/delete/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)


module.exports = router;
