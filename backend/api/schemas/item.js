const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String},
    price: {type: Number, required: true},
    userId: {type: mongoose.Types.ObjectId, required: true}
})

module.exports = mongoose.model('items', itemSchema)