import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Logout from "./pages/auth/Logout";
import Home from "./pages/Home";
import Profile from "./pages/user/Profile";
import CollectionCreate from "./pages/collection/CollectionCreate";
import CollectionSettings from "./pages/collection/CollectionSettings";

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path = "/login" element={<Login/>} />
        <Route path = "/signup" element={<Signup/>} />
        <Route path = "/logout" element={<Logout/>} />

        <Route path = "/user/:username" element={<Profile/>} />
        <Route path = "/collection/create" element={<CollectionCreate/>} />
        <Route path = "/collection/:collectionID/settings" element = {<CollectionSettings/>} />
      </Routes>
    </Router>

  );
}

export default App;
