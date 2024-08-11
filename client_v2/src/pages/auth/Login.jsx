import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import { login } from '../../redux/reducers/authSlice';
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch  = useDispatch();
    const navigate = useNavigate();
    

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login({username, password}));
        navigate("/");
    }


    return(
        <>
            {/* // plain jsx form for login with username and password */}
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" 
                onChange={(e) => setUsername(e.target.value) }
                required/>
                <br/>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" 
                onChange={(e) => setPassword(e.target.value) }
                required/>
                <input type="submit" value="Submit" onClick={handleLogin} />
            </form>
        </>
    )
}

export default Login;
