// Import des libs
const mongoose = require('mongoose')
const { Schema } = mongoose

const bcrypt = require('bcryptjs')

// Déclaration du schéma
const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phone: {
    type: String
  }
}, { timestamps: true })

// On crypte le mot de passe pour qu'il n'apparaisse pas en clair dans la base de données
// Méthode appelée à chaque enregistrement d'utilisateur
UserSchema.pre('save', function (next) {
  // this = user car la fonction save est appelée sur le User dans notre code
  const user = this
  // Si le mot de passe a été modifié ou si l'utilisateur est nouveau
  if (this.isModified('password') || this.isNew) {
    // Génération du "sel" nécéssaire pour le cryptage du mot de passe
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error)
      // Cryptage (hachage) du mot de passe
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error)
        // On remplace le mot de passe par le hash
        user.password = hash
        // On envoi la suite
        return next()
      })
    })
  }
})

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (error, isMatch) => {
    if (error) return callback(error)
    callback(null, isMatch)
  })
}

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
