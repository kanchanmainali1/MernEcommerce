const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    image:String,
    title:String,
    price:Number,
    salePrice:Number,
    description:String,
    category:String,
    brand:String,
    totalStock:Number
},
{
    timestamps:true} );
module.exports = mongoose.model('Product',ProductSchema);