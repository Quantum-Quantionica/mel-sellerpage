import logo from '../logo.svg';

export default function Header() {
    return <header>
        <button>Menu</button>
        <nav>
            <ul>
                <li>Home</li>
                <li>Products</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </nav>        
        <img src={logo} alt="logo" width="50" />
        <input type="text" placeholder="Search" />
    </header>;
}