const router = require('express').Router()
const request = require('request')

router.route('/') // Correspond à http://localhost:3000/countries
  .get((req, res) => {
    // Chargement de la liste des pays depuis un fichier
    const countries = require('../../data/countries-FR.json')
    // Envoi de la liste en réponse
    res.status(200).send(countries)
  })

router.route('/cities') // Correspond à http://localhost:3000/countries/cities
  .post((req, res) => {
  // Récupérer le pays depuis les paramètres de la requête
    const body = req.body
    const country = body.country
    // Vérification du paramètre de la requête
    if (!country) {
      return res.status(500).send('Country is missing')
    } else {
    // Récupérer la liste des villes en fonction du pays passé en paramètre
    // Préparation de la requête vers countriesnow
      const options = {
        method: 'POST',
        url: `${process.env.COUNTRIES_NOW_API_URL}/countries/cities`,
        headers: {
          'Content-Type': 'application/json'
        },
        // Intégration du paramètre récupéré depuis notre requête initiale
        body: JSON.stringify({
          country: country
        })
      }

      // Exécution de la requête vers l'API externe countriesnow
      request(options, function (error, response) {
      // Traitement d'une éventuelle erreur
        if (error) throw new Error(error)
        // Traitement des données reçues (transformation au format JSON)
        const body = JSON.parse(response.body)
        // Vérification des données reçues
        if (body && body.data && !body.error) {
        // Envoyer la liste des villes en réponse
          return res.send(body.data)
        } else {
        // Erreur de données
          res.status(500).send('Erreur lors de la récupération de la liste des villes')
        }
      })
    }
  })

module.exports = router
