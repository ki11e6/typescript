import { useState } from "react"
import Goal from "./components/Goal"
import Header from "./components/Header"

type CourseGoal = {
  title: string,
  description: string,
  id: number
}

const App = () => {
  const [goals, setGoals] = useState<CourseGoal[]>([])

  const addGoalHandler = (newGoal: CourseGoal) => {
    setGoals(prevGoals => [...prevGoals, newGoal])
  }

  return (
    <div>
      <Header image={{ src: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png', alt: 'Google Logo' }}>
        My Goals
      </Header>
      <button onClick={() => addGoalHandler({ title: 'Learn Typescript', description: 'Start learning Typescript', id: 1 })}>Add Goal</button>
      {goals.map(goal => <Goal key={goal.id} {...goal} />)}
    </div>
  )
}

export default App