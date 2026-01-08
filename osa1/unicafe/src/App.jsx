import { useState } from 'react'


const StatisticLine = (props) => {
  return(
  <tr>
    <td>{props.text}</td> 
    <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  const average = (props.good - props.bad) / all
  const positive = (props.good / all) * 100

  if (all === 0){
    return (<p>No feedback given</p>)
  }

  return (
    <table>
      <tbody>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive + ' %'} />
      </tbody>
    </table>
  )
}

const Button = (props) => (
  <button onClick={props.onClick}> {props.text}
  </button>
)


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" /> 

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
      
    </div>
  )
}

export default App