import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AdminPanel from './pages/AdminPanel';
import NewsDetails from './pages/NewsDetails';
import ImageNews from './Pages/ImageNews';
import VideoNews from './Pages/VideoNews';
import Admin from './pages/Admin';
import Main from './Pages/Main';
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Home />} />
        {/*<Route path="/ad" element={<Admin />} />*/}
          <Route
          path="/ad"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
  
        
      
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/images" element={<ImageNews />} />
        <Route path="/videos" element={<VideoNews />} />
        <Route path="/" element={<Main />} />
       {/* <Route path="/r" element={<Register />} />*/}
          <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>404 Not Found</div>} />
       
       
        <Route
  path="/admin"
  element={
    <PrivateRoute>
      <AdminPanel/>
    </PrivateRoute>
  }
/>
      </Routes>
    </Router>
  );


  
}

export default App;
