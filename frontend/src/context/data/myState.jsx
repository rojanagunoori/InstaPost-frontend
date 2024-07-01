import React, { useEffect, useState, useMemo } from 'react';
import MyContext from './MyContext';
import SocketContext from './SocketContext'; // Import SocketContext
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where, getDocs } from 'firebase/firestore';
import { fireDb, auth } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import socket from '../../socket/socket';
import io from "socket.io-client";

function MyState(props) {
    const [mode, setMode] = useState('light');
    const [searchkey, setSearchkey] = useState('');
    const [loading, setLoading] = useState(false);
    const [getAllPost, setgetAllPost] = useState([]);
    const [user, setUser] = useState(null);

    // Initialize socket connection
   // const socket = useMemo(() => io("http://localhost:3000"), []);

    useEffect(() => {
        // Register user with the socket connection
        if (user) {
            socket.emit('register', user.displayName || user.email);
        }
    }, [socket, user]);

    // Toggle mode function
    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = 'rgb(17, 24, 39)';
        } else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
        }
    };

    // Get all posts
    function getAllPosts() {
        setLoading(true);
        try {
            const q = query(collection(fireDb, "postPost"), orderBy('time'));
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let postArray = [];
                QuerySnapshot.forEach((doc) => {
                    // Include userId in each post post
                    postArray.push({ ...doc.data(), id: doc.id });
                });

                setgetAllPost(postArray);
                setLoading(false);
            });

            return () => unsubscribe(); // Unsubscribe from snapshot listener
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const updateposts = async (userId) => {
        try {
            const postsRef = collection(fireDb, 'postPost');
            const q = query(postsRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setgetAllPost(posts); // Update getAllPost state with the fetched posts
        } catch (error) {
            console.error('Error updating posts:', error);
        }
    };

    // Delete post function
    const deleteposts = async (id) => {
        try {
            await deleteDoc(doc(fireDb, "postPost", id));
            getAllPosts();
            toast.success("post deleted successfully");
        } catch (error) {
            console.log(error);
        }
    };

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        getAllPosts();
    }, []);

    useEffect(() => {
        socket.on('notification', (message) => {
            toast.success(message, {
                duration: 5000, // Duration in milliseconds
                position: 'top-right',
                style: {
                    background: mode === 'dark' ? '#333' : '#fff',
                    color: mode === 'dark' ? '#fff' : '#000',
                },
            }); // Display the toast notification
        });

        return () => {
            socket.off('notification'); // Clean up event listener
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            <MyContext.Provider value={{
                mode,
                toggleMode,
                searchkey,
                setSearchkey,
                loading,
                setLoading,
                getAllPost,
                deleteposts,
                updateposts,
                user
            }}>
                {props.children}
            </MyContext.Provider>
        </SocketContext.Provider>
    );
}

export default MyState;
