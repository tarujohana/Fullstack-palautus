import { useState,useEffect } from 'react'
import Filter from './components/filter'
import PersonForm from './components/personForm'
import Persons from './components/Persons' 
import personService from './services/persons' 
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([ ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

 useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error =>{
        showNotification('Failed to fetch persons from server', 'error')
      })
  }, [])  


const addperson = event => {
  event.preventDefault()

  const existingPerson = persons.find(p => p.name === newName)
  
  if (existingPerson){
    const confirmUpdate=window.confirm(
    `${newName} is already added to phonebook, replace the old number with a new one?`)

    if (confirmUpdate){
      const updatedPerson={
        ...existingPerson,
        number: newNumber
      }

    personService
      .update(existingPerson.id, updatedPerson)
      .then(returnedPerson=>{
        setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
        showNotification(`Updated ${returnedPerson.name}'s number`)
        setNewName('')
        setNewNumber('')
    })
      .catch(error=>{
        showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error')
        setPersons(persons.filter(p => p.id !== existingPerson.id))
      })
  }
    return
}

  const personObject = {
    name: newName,
    number: newNumber
  }

  personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      showNotification(`Added ${returnedPerson.name}`)  
      setNewName('')
      setNewNumber('')
    })
}

  const personsToShow = filter ===''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) 
  )

  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  } 

  const handleFilterChange = (event) =>{
    setFilter(event.target.value)
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(id)
        .then(() => {
         showNotification(`Deleted ${person.name}`)  
         setPersons(persons.filter(p => p.id !== id))
  }).catch ((error)=> {
        showNotification(`${person.name} has already been removed from server`, 'error')
        setPersons(persons.filter(p => p.id !== id))
  })
    }
  }

  const showNotification =(message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)  
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      < Filter 
          filter={filter}
          handleFilterChange={handleFilterChange}   
      />
      <h2>Add new</h2>
      < PersonForm 
          addperson={addperson}
          newName={newName}
          handleNameChange={handleNameChange}
          newNumber={newNumber}
          handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      < Persons persons ={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App