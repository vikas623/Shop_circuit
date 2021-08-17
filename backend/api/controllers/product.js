const Product  = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")
const product = require("../models/product")
const { sortBy } = require("lodash")


exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Product Not found"
            });
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: " Problem with Image "
            });
        }
        // destructre the fields
        const { name, price, description, stock, category } = fields;

        if( !name || !price || !description || !stock || !category ){
            res.status(400).json({
                error: " All Fields are Required "
            })

        }

        
        let product = new Product(fields)


        // handel file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400),json({
                    error : "File Size is Too Large"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //saving in DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Saving product Failed"
                })
            }
            res.json(product)
        });
    });
};

// SOme Error Will Have to edit
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit)  : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy :"_id";

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, product) =>{
        if(err){
            return res.status(400).json({
                error: "No category Found"
            });  
        }
        res.json( product );
    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
};

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: " Problem with Image "
            });
        }
        
        // Updation Code
        let product =  req.product
        product = _.extend(product, fields)


        // handel file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400),json({
                    error : "File Size is Too Large"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //saving in DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Updation Failed"
                })
            }
            res.json(product)
        });
    });
};


exports.deleteProduct = (req, res) => {
    const product = req.product
    product.deleteOne((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: " Product Not Found"
            })
        }
        res.json({
            message : " Deleted Successfully ",
            deletedProduct
        })
    })
}

exports.getAllUniqueCategory = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error: " No category Found"
            })
        }
        res.json(category)
    })
}

// Middlewere

// Get Photos 
exports.getPhoto = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};


// Update Inventory
exports.updateStock = (req ,res, next) => {

    let myOperations = req.body.order.product.map(prod => {
        return {
            upateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: " Bulk operation failed"
            });
        }
        next();
    })
}