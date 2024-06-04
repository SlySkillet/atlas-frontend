import './header.css'


const Header = () => {
    return (
        <div className="header-container">
            <h1>Atlas Social</h1>
            <a className='button' href="/signup">Signup</a>
            <a className='button'>Login</a>
        </div>
    )
}

export default Header
