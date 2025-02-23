import Link from 'next/link';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logoName">Foodcourt</span>
      </div>
      <ul className="navList">
        <li className="navItem">
          <Link href="/home">Home</Link>
        </li>
        <li className="navItem">
          <Link href="/menu">Menu</Link>
        </li>
        <li className="navItem">
          <Link href="/tables">Tables</Link>
        </li>
        <li className="navItem">
          <Link href="/checkout">Checkout</Link>
        </li>
        <li className="navItem">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className="navItem">
          <Link href="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
