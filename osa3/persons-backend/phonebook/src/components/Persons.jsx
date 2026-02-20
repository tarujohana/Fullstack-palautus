const Person = ({ person, deletePerson }) => (
  <p>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person.id)}>
      delete
    </button>
  </p>
)

const Persons = ({ persons = [], deletePerson }) => (
  <div>
    {persons.map(person =>
      <Person 
      key={person.name} 
      person={person} 
      deletePerson={deletePerson} />
    )}
  </div>
)

export default Persons
