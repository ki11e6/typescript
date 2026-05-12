import type { ReactNode } from 'react'

export type GoalProps = {
  id: string | number
  title: string
  description: string
  children?: ReactNode
}

function Goal({ id, title, description, children }: GoalProps) {
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
