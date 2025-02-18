import Link from 'next/link';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navList">
        <li className="navItem">
          <Link href="/login">Login</Link>
        </li>
        <li className="navItem">
          <Link href="/home">Home</Link>
        </li>
        <li className="navItem">
          <Link href="/home/restaurants">Restaurants</Link>
        </li>
        <li className="navItem">
          <Link href="/menu">Menu</Link>
        </li>
        <li className="navItem">
          <Link href="/tables">Book Tables</Link>
        </li>
        <li className="navItem">
          <Link href="/checkout">Checkout</Link>
        </li>
        <li className="navItem">
          <Link href="/waiting">Waiting Time</Link>
        </li>
        <li className="navItem">
          <Link href="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
