const mongoose = require('mongoose')
const { Schema } = mongoose
// = const Schema = mongoose.Schema

// Déclaration du Schéma
const RestaurantSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Restaurant', RestaurantSchema)
