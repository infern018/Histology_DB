import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/authSlice";
import { Link } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    dispatch(logout());
  };

  return (
    <>
      Are you sure you want to logout? <br />
      <Link to="/" onClick={handleLogout}>
        Yes
      </Link>{" "}
      <br />
    </>
  );
};

export default Logout;
