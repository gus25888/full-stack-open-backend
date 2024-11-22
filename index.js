const express = require('express');
const app = express()
const PORT = 3001;

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

/* *********** METHODS *********** */
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const personFound = persons.find(person => person.id === id)
    if (personFound) {
        return res.json(personFound)
    }
    else {
        return res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
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

    if (persons.map(person => person.name).includes(name)) {
        return res.status(400).json({
            error: 'name already exists in phonebook'
        })
    }

    const newPerson = {
        id: Math.round(Math.random() * (10 ** 5)),
        name,
        number,
    }

    persons.push(newPerson)
    res.json(newPerson)
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})


app.get('/info', (req, res) => {
    res.send(
        `<p>
        Phonebook has info for ${persons.length} people
        </p>
        <p>
        ${new Date()}
        </p>
        `
    )
})


/* *********** SERVER INIT *********** */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})