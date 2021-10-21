/**
 * 1) Créer modèle de Document mongoDB
 *    - nom, description, prix, catégorie (énumération) (starter, dish, dessert, drink)
 * 2) Créer la route d'API
 *    - CRUD pour la gestion des plats en utilisant les bonnes méthodes HTTP
 * 3) BONUS : Associer des plats à un restaurant
 */

const router = require('express').Router()

const Dish = require('../../models/Dish')

router.route('/')
  .get((req, res) => {
    Dish.find((error, result) => {
      if (error) return res.status(500).send('Database Error')
      return res.send(result)
    })
  })
  .post((req, res) => {
    const { body: { name, description, price, category } } = req

    if (!name || !price || !category) return res.status(500).send('Missing data')

    const dish = new Dish({
      name, description, price, category
    })

    dish.save((error, result) => {
      if (error) return res.status(500).send(error)
      Dish.find((error, result) => {
        if (error) return res.status(500).send('Database Error')
        return res.send(result)
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
