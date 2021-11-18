/**
 * 1) Créer modèle de Document mongoDB
 *    - nom, description, prix, catégorie (énumération) (starter, dish, dessert, drink)
 * 2) Créer la route d'API
 *    - CRUD pour la gestion des plats en utilisant les bonnes méthodes HTTP
 * 3) BONUS : Associer des plats à un restaurant
 */

const router = require('express').Router()

const Dish = require('../../models/Dish')
const Restaurant = require('../../models/Restaurant')

router.route('/')
  .get((req, res) => {
    // Récupération des plats pour 1 restaurant donné
    const id = req.query.id
    // console.log(req.params)
    if (id) {
      Dish.find({ restaurant: id }, (error, result) => {
        if (error) return res.status(500).send('Database Error')
        return res.send(result)
      })
    } else {
      Dish.find((error, result) => {
        if (error) return res.status(500).send('Database Error')
        return res.send(result)
      })
    }
  })
  .post((req, res) => {
    const { body: { name, description, price, category, restaurant } } = req

    if (!name || !price || !category || !restaurant) return res.status(500).send('Missing data')

    const dish = new Dish({
      name, description, price, category, restaurant
    })

    dish.save((error, result) => {
      if (error) return res.status(500).send(error)

      // Lien vers le restaurant
      // On récpère le restaurant
      Restaurant.findById(restaurant, (error, resto) => {
        if (error) return res.status(500).send(error)
        // On ajoute le plat dans le restaurant
        resto.dishes.push(dish)
        // On enregistre le restaurant
        resto.save((error, result) => {
          if (error) return res.status(500).send(error)
          // On envoit la liste des plats
          Dish.find((error, result) => {
            if (error) return res.status(500).send('Database Error')
            return res.send(result)
          })
        })
      })
    })
  })
  .delete((req, res) => {
    const { body: { id } } = req

    if (!id) return res.status(500).send('ID is missing')

    Dish.findByIdAndDelete(id, (error, result) => {
      if (error) res.status(500).send(error)
      Dish.find((error, result) => {
        if (error) return res.status(500).send('Database Error')
        return res.send(result)
      })
    })
  })
  .patch((req, res) => {
    const { body: { dish } } = req

    if (!dish) return res.status(500).send('Missing data')

    const { _id } = dish

    if (!_id) return res.status(500).send('Missing ID')

    Dish.findByIdAndUpdate(_id, dish, (error, result) => {
      if (error) return res.status(500).send(error)
      Dish.find((error, result) => {
        if (error) return res.status(500).send('Database Error')
        return res.send(result)
      })
    })
  })

module.exports = router
