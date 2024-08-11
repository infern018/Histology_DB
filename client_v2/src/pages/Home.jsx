import Navbar from "../components/navbar/Navbar";
import {useSelector} from 'react-redux';


const Home  = () => {

    const user = useSelector(state=>state.auth.currentUser);

    return (
        <>
            <Navbar/>
            <h1>Welcome to the Home Page</h1>

            {user && <h1>Hey {user.username}</h1>}
        </>
    );
}

export default Home;
