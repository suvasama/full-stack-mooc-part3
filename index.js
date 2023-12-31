const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', function getBody (request, response) {
  return JSON.stringify(request.body) 
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  // this works on my browser without the Number declaration
  const id = Number(request.params.id)
  const person = persons.find(person => person.id == id)
  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing"
    })
  }
  if (persons.some(person => person.name==body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }
  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) =>{
  let date_ob = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${date_ob.toString()}</p>`
  )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{ 
  console.log(`Server running on port ${PORT}`)
})