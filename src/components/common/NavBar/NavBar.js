import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="nav-left">
        <img src="/logo.png" alt="전북대학교" className="logo" />
        <span className="coala">COALA </span>
      </div>

      <div className="nav-center">
        <NavLink to="/introduce" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        Introduce </NavLink>
        <NavLink to="/notice" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        Notice </NavLink>
        <NavLink to="/board" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        Board </NavLink>
        <NavLink to="/event" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        Event </NavLink>
        <NavLink to="/game" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        game </NavLink>
        <NavLink to="/member" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        member </NavLink>
      </div>

      <div className="nav-right">
        <NavLink to="/login">LOGIN</NavLink>
        <span>|</span>
        <NavLink to="/signup">SIGNUP</NavLink>
      </div>
    </div>
  );
};

export default NavBar;
