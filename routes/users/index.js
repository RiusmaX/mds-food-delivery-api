const router = require('express').Router()

const User = require('../../models/User')

const withAuth = require('../../middlewares/authMiddleware')
const { extractIdfromRequestAuthHeader } = require('../../helpers/TokenHelper')

// Récupère et retourne un utilisateur par son ID
router.route('/')
  .get(withAuth, (req, res) => {
    const id = extractIdfromRequestAuthHeader(req)

    // Méthode Callback
    // User.findById(id, (error, result) => {
    //   if (error) return res.status(500).send(error)
    //   return res.send(result)
    // })

    // Méthode Promesse en retirant le password des données retournées par mongodb
    User.findById(id).select('-password')
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error))
  })

module.exports = router
