const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String, required: true
    },
    price: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        }
    },
    description: {
        type: String, required: true
    },
    image: {
        type: String, required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;