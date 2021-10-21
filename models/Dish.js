const mongoose = require('mongoose')
const { Schema } = mongoose
// = const Schema = mongoose.Schema

// Déclaration du Schéma
const DishSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['starter', 'dish', 'dessert', 'drink']
  }
}, { timestamps: true })

module.exports = mongoose.model('Dish', DishSchema)
