const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.route('/create-session')
  .post(async (req, res) => {
    const { order } = req.body
    console.log(JSON.stringify(order))
    const session = await stripe.checkout.sessions.create({
      line_items: order.cart.map(item => {
        return {
          price_data: {
            currency: 'EUR',
            product_data: {
              name: item.dish.name
            },
            unit_amount: Number(Number(item.dish.price).toFixed(2) * 100).toFixed(0)
          },
          quantity: item.quantity
        }
      }),
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    })

    return res.send(session)
  })

module.exports = router
