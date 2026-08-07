const Persons = ({ personsToShow, deletePerson }) => (
    <ul>
    {personsToShow.map(p => (
        <li key={p.id}>
        {p.name} {p.number}
        <button onClick={() => deletePerson(p.id, p.name)}>delete</button>
        </li>
    ))}
    </ul>
)

export default Persons
