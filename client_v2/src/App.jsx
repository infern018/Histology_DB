import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Logout from "./pages/auth/Logout";
import Home from "./pages/Home";
import Profile from "./pages/user/Profile";
import CollectionCreate from "./pages/collection/CollectionCreate";
import CollectionEdit from "./pages/collection/CollectionEdit";
import CollectionSettings from "./pages/collection/CollectionSettings";
import GithubLogin from "./pages/auth/Github";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import CollectionEntriesPage from "./pages/collection/CollectionEntries";
import CreateEntryStepper from "./pages/entries/CreateEntryStepper";
import EntryDetailsPage from "./pages/entries/EntryDetails";
import PublicCollections from "./pages/collection/PublicCollections";
import CollectionEntriesChart from "./pages/collection/CollectionEntriesChart";
import LandingPage from "./pages/LandingPage";
import SearchResults from "./pages/SearchResults";
import CollectionDetails from "./pages/collection/CollectionDetails";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection/public" element={<PublicCollections />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/github_login" element={<GithubLogin />} />

          <Route path="/user/:username" element={<Profile />} />
          <Route path="/collection/create" element={<CollectionCreate />} />
          <Route
            path="/collection/:collectionID/edit"
            element={<CollectionEdit />}
          />
          <Route
            path="/collection/:collectionID"
            element={<CollectionDetails />}
          />
          <Route
            path="/collection/:collectionID/entries"
            element={<CollectionEntriesPage />}
          />
          <Route
            path="/visualize/collection/:collectionID"
            element={<CollectionEntriesChart />}
          />
          <Route
            path="/collection/:collectionID/settings"
            element={<CollectionSettings />}
          />
          <Route
            path="/collection/:collectionID/entry/create"
            element={<CreateEntryStepper />}
          />
          <Route
            path="/collection/:collectionID/entry/:entryID/edit"
            element={<CreateEntryStepper />}
          />
          <Route path="/entry/:entryID" element={<EntryDetailsPage />} />
          <Route path="/v2" element={<LandingPage />} />
          <Route path="/search/results" element={<SearchResults />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
