require('dotenv').config()
const express = require('express');
const morgan = require('morgan');

const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.static('dist'))

// Config. logs para métodos que no son POST.
app.use(
    morgan('tiny', {
        skip: (req, res) => req.method === 'POST'
    })
)

// Config. logs para métodos POST.
morgan.token('post-data', (req) => JSON.stringify(req.body))

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :post-data',
        { skip: (req, res) => req.method !== 'POST' }
    )
)

const errorHandler = (error, req, res, next) => {
    console.error(error.name, ':', error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'wrong formatted id' })
    }

    next(error)
}

/* *********** METHODS *********** */
app.get('/api/persons', (req, res, next) => {
    Person
        .find({})
        .then(result => {
            if (result) {
                return res.json(result)
            } else {
                return res.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.get('/api/persons/:id', (req, res, next) => {
    Person
        .findById(req.params.id)
        .then(result => {
            if (result) {
                return res.json(result)
            } else {
                return res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const data = req.body;

    if (!data) {
        return res.status(400).json({
            error: 'incomplete request'
        })
    }

    const { name, number } = data;

    if (!name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }
    if (!number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }

    const newPerson = new Person({ name, number });

    newPerson
        .save()
        .then(result => {
            if (result) {
                return res.json(result)
            } else {
                return res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndDelete(req.params.id)
        .then(result => { res.status(204).end() })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;
    const personToUpdate = { name, number }

    Person
        .findByIdAndUpdate(req.params.id, personToUpdate, { new: true })
        .then(result => {
            if (result) {
                return res.json(result)
            } else {
                return res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    let peopleCount = 0;

    Person
        .find({})
        .then(result => {
            if (result) {
                peopleCount = result.length;
            }

            res.send(
                `<p>
                Phonebook has info for ${peopleCount} people
                </p>
                <p>
                ${new Date()}
                </p>
                `
            )
        })
        .catch(error => {
            res.send(
                `<p>
                Phonebook is disconnected
                </p>
                <p>
                ${new Date()}
                </p>
                `
            )
        })
})

const unknownEndpoint = (req, res, next) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

/* *********** SERVER INIT *********** */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})