const express = require("express");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors");
const connectDB = require('./api/config/db')
connectDB()

// My Routes
const authRoutes = require("./api/routes/auth")
const userRoutes = require("./api/routes/user")
const categoryRoutes = require("./api/routes/category")
const productRoutes = require("./api/routes/product")
const orderRoutes = require("./api/routes/order")


const app = express();

// middlewares
// app.use(cookieParser);
app.use(bodyParser.json());
// app.use(cors());
app.use(authRoutes);

// routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);



app.get("/", (req,res)=>{
    return res.send("hello");
});

// server
const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`)
});


