type Image = {
    src: string,
    alt: string
}

type HeaderProps = {
    children: React.ReactNode,
    image: Image
}

const Header: React.FC<HeaderProps> = ({ children, image }) => {
    return (
        <div>
            <img src={image.src} alt={image.alt} />
            {children}
        </div>
    )
}

export default Header