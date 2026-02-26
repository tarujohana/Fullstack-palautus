const http = require('http')
require('dotenv').config()
const express = require('express')
const Person = require('./models/person')  
const app = express()   
const morgan = require ('morgan')
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}


morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
    response.json(persons)
    })
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
  response.send(`Phonebook has info for ${count} people<br>${new Date()}`)
})
})

/**Get one person */
app.get('/api/persons/:id', (request, response, next) => {
   Person.findById(request.params.id).then(person =>{
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()    
    }
})
.catch(error => next(error))
})


/**Delete one person */
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
  response.status(204).end()
})
.catch(error => next(error))
})


/**Add new person */
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = body.name
      person.number = body.number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})