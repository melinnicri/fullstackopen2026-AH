const Persons = ({ personsToShow }) => {
    return (
    <ul>
        {personsToShow.map(p => (
        <li key={p.name}>
            {p.name} {p.number}
        </li>
        ))}
    </ul>
)
}

export default Persons
