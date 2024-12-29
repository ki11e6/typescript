// import { PropsWithChildren } from "react"

// type GoalProps = PropsWithChildren<{
//   id: string
//   title: string
//   description: string
// }>

// const Goal = ({ id, title, description, children }: GoalProps) => {
// const Goal = ({ id, title, description, children }: GoalProps) => {
const Goal: React.FC<GoalProps> = ({ id, title, description, children }) => {

  return (
    <article>
      {children}
      <div key={id}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button>Remove</button>
    </article>
  )
}

export default Goal