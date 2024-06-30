
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import io from "socket.io-client";
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
import MyContext from './context/data/myContext';

const socket = io.connect("http://localhost:3003"); // Ensure this matches the backend URL

const App = () => {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");
    const [joinRoom, setJoinRoom] = useState("");

    const sendMessage = () => {
        socket.emit("send_message", { message, joinRoom });
    };

    const sendRoom = () => {
        if (joinRoom !== "") {
            socket.emit("join_room", joinRoom);
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageReceived(data.message);
        });

        socket.on('new_post_post', (data) => {
            // Handle the new post post notification here
            console.log('New post post:', data);
        });

    }, []);

    return (
        <>
            <div className="App">
                <input placeholder="Room Number" onChange={(e) => { setJoinRoom(e.target.value) }} />
                <button onClick={sendRoom}>Join Room</button>
                <input placeholder="Message...." onChange={(e) => { setMessage(e.target.value) }} />
                <button onClick={sendMessage}>Send Message</button>
                <h1>Message:</h1>
                {messageReceived}
            </div>
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
