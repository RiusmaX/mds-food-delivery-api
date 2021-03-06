require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}.jpg`)
  }
})
const upload = multer({ storage: storage })

// On importe le middleware chargé d'enregistrer les appels d'API
const loggerMiddleware = require('./middlewares/logger')
const { response } = require('express')

const app = express()

// Autoriser les requêtes depuis le front React (Access Control Allow Origin)
app.use(cors())

// On dit a Express d'utiliser le middleware
app.use(loggerMiddleware)

// Initialisation de Express pour utiliser le body des requêtes au format UrlEncoded et JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))

const router = express.Router()

// On définit le port d'écoute
const port = process.env.PORT

// Chaîne de connexion à la base de données MongoDB
const mongoDbConnectionString =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

// Lancement de la connexion à la base de données avec les paramètres précédents
mongoose.connect(mongoDbConnectionString, null, error => {
  if (error) throw new Error(error)
})

// Récupération de la connexion
const db = mongoose.connection
// Listener de connexion pour valider la connexion
db.once('open', () => {
  console.info('Connexion à la base : OK')
})

// Route "/" en GET
// req = request
// res = response
app.get('/', (req, res) => {
  res.send('Coucou !')
})

app.post('/upload', upload.single('file'), function (req, res, next) {
  console.log(req.file)
  console.log(req.body)
  return res.send(req.file)
})

// Utilisation du router par Express
app.use(router)

// Déclaration des routes d'API principales
app.use('/countries', require('./routes/countries'))
app.use('/restaurants', require('./routes/restaurants'))
app.use('/dishes', require('./routes/dishes'))
app.use('/auth', require('./routes/users/auth'))
app.use('/me', require('./routes/users'))
app.use('/payment', require('./routes/payment'))
app.use('/order', require('./routes/order'))

// Lancement du server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
