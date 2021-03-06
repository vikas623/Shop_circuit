const express = require("express")
const router = express.Router()

const{isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const{ getUserById, pushOrderInPurchaseList } = require("../controllers/user")
const{ updateStock } = require("../controllers/product")

const{ getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrder } = require("../controllers/order")

// Param
router.param("userId", getUserById)
router.param("orderId", getOrderById)

// Routes
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders )
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateOrder)

module.exports = router;




