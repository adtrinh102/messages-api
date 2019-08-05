const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4000

const Movie = sequelize.define('movie', {
    title: Sequelize.TEXT,
    yearOfRelease: Sequelize.INTEGER,
    synopsis: Sequelize.TEXT
}, { timestamps: false })

sequelize.sync()
    .then(() => console.log('Table created successfully'))
    .then(() => Promise.all([
        Movie.create({ title: 'Lion King', yearOfRelease: 1994, synopsis: 'A Lion cub crown prince is tricked by a treacherous uncle into thinking he caused his father\'s death and flees into exile in despair, only to learn in adulthood his identity and his responsibilities.' }),
        Movie.create({ title: 'Mulan', yearOfRelease: 1998, synopsis: 'To save her father from death in the army, a young maiden secretly goes in his place and becomes one of China\'s greatest heroines in the process.' }),
        Movie.create({ title: 'Aladdin', yearOfRelease: 1992, synopsis: 'A kindhearted street urchin and a power-hungry Grand Vizier vie for a magic lamp that has the power to make their deepest wishes come true.' })
    ]))
    .catch(console.error())

app.use(bodyParser.json())

app.post('/movies', (req, res, next) => {
    Movie.create(req.body)
        .then(movie => res.json(movie))
        .catch(next)
})

app.get('/movies', (req, res, next) => {
    const limit = req.query.limit || 5
    const offset = req.query.offset || 0

    Promise.all([
        Movie.count(),
        Movie.findAll({ limit, offset })
    ])
        .then(([total, movies]) => {
            res.send({
                movies, total
            })
        })
        .catch(next)
})

app.get('/movies/:id', (req, res, next) => {
    Movie.findByPk(req.params.id)
        .then(movie => res.json(movie))
        .catch(next)
})

app.put('/movies/:id', (req, res, next) => {
    Movie.findByPk(req.params.id)
        .then(movie => movie.update(req.body))
        .then(movie => res.json(movie))
        .catch(next)
})

app.delete('/movies/:id', (req, res, next) => {
    Movie.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(numDeleted => {
            if (numDeleted) {
                return res.status(204).end()
            }
            else {
                return res.status(404).end()
            }
        })
        .catch(next)
})

app.listen(port, () => console.log(`Listening on port ${port}`))