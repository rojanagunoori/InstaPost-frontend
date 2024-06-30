import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/FirebaseConfig'; 
import io from "socket.io-client"

const socket=io.connect("http://localhost:3003")

function MyState(props) {
    const [mode, setMode] = useState('light');
    const [searchkey, setSearchkey] = useState('');
    const [loading, setLoading] = useState(false);
    const [getAllPost, setgetAllPost] = useState([]);
    const [user, setUser] = useState(null);

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
            const q = query(
                collection(fireDb, "postPost"),
                orderBy('time')
            );
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
            const db = getFirestore();
            const postsRef = collection(db, 'posts');
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
            console.log("äuth user",user)
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        getAllPosts();
    }, []);

    

    return (
        <MyContext.Provider value={{
            mode,
            toggleMode,
            searchkey,
            setSearchkey,
            loading,
            setLoading,
            getAllPost,
            deleteposts,
            updateposts ,
            user
        }}>
            {props.children}
        </MyContext.Provider>
    );
}

export default MyState;
