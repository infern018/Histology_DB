import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CollectionList from "./pages/collectionList/CollectionListPublic";
import EntryList from "./pages/entryList/EntryList";
import EntryInfo from "./pages/entryInfo/EntryInfo";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useSelector } from 'react-redux'
import CollectionCreate from "./pages/collections/CollectionCreate";
import CollectionListPrivate from "./pages/collectionList/CollectionListPrivate";
import RequestDetails from "./pages/requestManager/RequestDetails";
import CollectionEdit from "./pages/collections/CollectionEdit";
import EntryCreate from "./pages/entries/EntryCreate";
import CollectionEditColab from "./pages/collections/CollectionCollaborators";
import CollaboratorAdd from "./pages/collaborators/CollaboratorAdd";
import CollaboratorEdit from "./pages/collaborators/CollaboratorEdit";

const App = () => {

  const user = useSelector(state=> state.user.currentUser);


  return (
    
    <Router>
      <Routes>

        <Route exact path="/" element={<Home/>} />

        <Route path="/collections/public" element={<CollectionList/>} />
        <Route path="/collection/:collectionID" element = {<EntryList/>} />  
        <Route path="/entry/:entryId" element = {<EntryInfo/>} />

        <Route path="/collections/private/:userId" element={<CollectionListPrivate/>}/>
        {/* create dashboard page where u can manage approval requests and all separate for admin and general public */}

        <Route path="/login" element={user ? <Navigate to="/" replace /> :  <Login />}  />
        <Route path = "/register" element={user ? <Navigate to="/" replace /> :  <Register />} />


        {
          user &&
          <>
          <Route path = "/admin/requests" element={user.isAdmin ? <RequestDetails /> : <Navigate to={`/`} replace />} />
          <Route path = "/createCollection" element={<CollectionCreate/>} />
          <Route path = "/collection/:collectionID/createEntry" element={<EntryCreate/>} />
          <Route path = "/editCollection/:collectionID" element={<CollectionEdit/>}/>
          <Route path = "/collection/:collectionID/settings" element={<CollectionEditColab/>}/>
          <Route path = "/collection/:collectionID/addCollaborator" element={<CollaboratorAdd/>}/>
          <Route path = "/collection/:collectionID/editCollaborator/:roleID" element={<CollaboratorEdit/>}/>
          </>
        }

      </Routes>
    </Router>
  );
};

export default App;