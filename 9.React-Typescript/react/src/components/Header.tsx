import type { ReactNode } from 'react'

type Image = {
  src: string
  alt: string
}

type HeaderProps = {
  children: ReactNode
  image: Image
}

function Header({ children, image }: HeaderProps) {
  return (
    <div>
      <img src={image.src} alt={image.alt} />
      {children}
    </div>
  )
}

export default Header
