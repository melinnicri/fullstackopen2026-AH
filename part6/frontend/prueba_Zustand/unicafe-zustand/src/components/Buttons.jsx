import { useUnicafeStore } from '../store'

const Buttons = () => {
  const incrementGood = useUnicafeStore((state) => state.incrementGood)
  const incrementNeutral = useUnicafeStore((state) => state.incrementNeutral)
  const incrementBad = useUnicafeStore((state) => state.incrementBad)

  return (
    <div>
      <button onClick={incrementGood}>good</button>
      <button onClick={incrementNeutral}>neutral</button>
      <button onClick={incrementBad}>bad</button>
    </div>
  )
}
export default Buttons