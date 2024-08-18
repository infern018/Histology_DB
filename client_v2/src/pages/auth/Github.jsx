import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/utils/Loader";

const GithubLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userData = queryParams.get("user"); // Get the user data from query parameter
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      const parsedUserData = JSON.parse(userData); // Parse the user data

      // Prepare user data for dispatch
      const userToDispatch = {
        username: parsedUserData.username || "", // Use GitHub username
        githubId: parsedUserData.githubId || "", // Use GitHub ID
      };

      // Dispatch the user data to the Redux store
      dispatch(login(userToDispatch));
      navigate("/"); // Navigate to home or another appropriate route
    }
  }, [userData, dispatch, navigate]);

  useEffect(() => {
    if (userData) {
      setLoading(false); // Set loading to false once user data is processed
    }
  }, [userData]);

  return (
    <>
      {loading && <Loader />}
      <h1>Github Login</h1>
      {/* You can render more user information or perform additional actions here */}
    </>
  );
};

export default GithubLogin;
