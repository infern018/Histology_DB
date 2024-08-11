import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const user = useSelector((state) => state.auth.currentUser);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
        {user && (
            <Link to={`/collection/create`} className="navbar-link navbar-item">
              +
            </Link>
          )}
        </div>
        <div className="navbar-right">
          {!user && (
            <Link to={`/login`} className="navbar-link navbar-item">
              Log in
            </Link>
          )}

          {!user && (
            <Link to={`/signup`} className="navbar-link navbar-item">
              Sign up
            </Link>
          )}
          {/* another hyperlink that takes user to user page */}
          {user && (
            <Link
              to={`/user/${user.username}`}
              state={{ user: user }}
              className="navbar-link navbar-item"
            >
              {user.username}
            </Link>
          )}
          {user && (
            <Link to={`/logout`} className="navbar-link navbar-item">
              Logout
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
