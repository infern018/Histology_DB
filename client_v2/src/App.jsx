import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Logout from "./pages/auth/Logout";
import Home from "./pages/Home";
import Profile from "./pages/user/Profile";
import CollectionCreate from "./pages/collection/CollectionCreate";
import CollectionSettings from "./pages/collection/CollectionSettings";
import GithubLogin from "./pages/auth/Github";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: ["Montserrat"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login/github" element={<GithubLogin />} />

          <Route path="/user/:username" element={<Profile />} />
          <Route path="/collection/create" element={<CollectionCreate />} />
          <Route
            path="/collection/:collectionID/settings"
            element={<CollectionSettings />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
