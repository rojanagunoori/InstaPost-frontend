
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Post from "./pages/post/Post";
import AllPosts from "./pages/allPosts/AllPosts";
import NoPage from "./pages/nopage/NoPage";
import PostInfo from "./pages/postInfo/PostInfo";
import AdminLogin from "./pages/admin/adminLogin/AdminLogin";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import MyState from "./context/data/myState";
import CreatePost from "./pages/admin/createPost/CreatePost";
import { Toaster } from "react-hot-toast";
import MyContext from './context/data/MyContext';
import Chat from './components/Chat/Chat';
import './App.css';



const App = () => {
    const [userId, setUserId] = useState('');
  const [peerId, setPeerId] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setUserId(e.target.userId.value);
    setPeerId(e.target.peerId.value);
  };

    return (
        <>
        {/* <div className="App">
      {!userId ? (
        <form onSubmit={handleLogin} className="login-form">
          <input name="userId" type="text" placeholder="Your Username" required />
          <input name="peerId" type="text" placeholder="Peer Username" required />
          <button type="submit">Login</button>
        </form>
      ) : (
        <>
          <h1>Private Chat App</h1>
          <Chat userId={userId} peerId={peerId} />
        </>
      )}
    </div>*/}
            
            <MyState>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                     {/*  <Route path="/post" element={<Post />} />*/}
                        <Route path="/allposts" element={<AllPosts />} />
                        <Route path="/postinfo/:id" element={<PostInfo />} />
                        <Route path="/adminlogin" element={<AdminLogin />} />
                        <Route path="/dashboard" element={
                            <ProtectedRouteForAdmin>
                                <Dashboard />
                            </ProtectedRouteForAdmin>
                        } />
                        <Route path="/createpost" element={
                            <ProtectedRouteForAdmin>
                                <CreatePost />
                            </ProtectedRouteForAdmin>
                        } />
                        <Route path="/*" element={<NoPage />} />
                    </Routes>
                    <Toaster />
                </Router>
            </MyState>
        </>
    );
};

export default App;

export const ProtectedRouteForAdmin = ({ children }) => {
    const { user } = useContext(MyContext);

    if (!user) {
        return <Navigate to="/adminlogin" />;
    }

    return children;
};