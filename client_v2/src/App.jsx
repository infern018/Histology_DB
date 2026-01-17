import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminPanel from "./pages/admin/AdminPanel";
import GithubLogin from "./pages/auth/Github";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Signup from "./pages/auth/Signup";
import BulkUploadEntries from "./pages/collection/BulkUploadEntries";
import CollectionCreate from "./pages/collection/CollectionCreate";
import CollectionDetails from "./pages/collection/CollectionDetails";
import CollectionEdit from "./pages/collection/CollectionEdit";
import CollectionEntriesPage from "./pages/collection/CollectionEntries";
import CollectionEntriesChart from "./pages/collection/CollectionEntriesChart";
import CollectionSettings from "./pages/collection/CollectionSettings";
import PublicCollections from "./pages/collection/PublicCollections";
import CreateEntryStepper from "./pages/entries/CreateEntryStepper";
import EntryDetailsPage from "./pages/entries/EntryDetails";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/user/Profile";
import { verifyUser } from "./redux/reducers/authSlice";
import theme from "./theme";

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (currentUser?.accessToken) {
      dispatch(verifyUser());
    }
  }, []); // run ONCE on app load

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
            path="/collection/:collectionID/bulk-upload"
            element={<BulkUploadEntries />}
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
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
