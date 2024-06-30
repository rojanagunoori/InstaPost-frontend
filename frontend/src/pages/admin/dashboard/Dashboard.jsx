import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../../compoents/layout/Layout';
import myContext from '../../../context/data/myContext';
import { Button } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, deleteObject } from "firebase/storage";

import { getFirestore, collection, query, where, getDocs, deleteDoc,doc  } from 'firebase/firestore';

function Dashboard() {
    const context = useContext(myContext);
    const { mode, getAllPost, deleteposts,updateposts } = context;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();
console.log("getAllPost,user",getAllPost,user?.uid)
    //* Logout Function 
    const logout = async () => {
        try {
            const db = getFirestore();
            const storage = getStorage();
            const currentUser = auth.currentUser;
    
            if (!currentUser) {
                console.error('No user is currently signed in');
                return;
            }
    
            const userId = currentUser.uid;
    
            // Reference to the collection of posts
            const postsRef = collection(db, 'postPost'); // Ensure this matches your collection name
    
            // Query to get all posts for the user
            const q = query(postsRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
    
            console.log(`Found ${querySnapshot.size} posts for user ${userId}`);
    
            // Delete each post document and associated image
            for (const docSnap of querySnapshot.docs) {
                console.log(`Deleting post with ID: ${docSnap.id}`);
                
                const postData = docSnap.data();
    
                // Delete the post image from Firebase Storage
                if (postData.thumbnail) {
                    const imageRef = ref(storage, postData.thumbnail);
                    await deleteObject(imageRef);
                }
    
                // Delete the post document from Firestore
                await deleteDoc(doc(db, 'postPost', docSnap.id));
            }
    
            // Update posts state after deletion
            updateposts(userId);
    
            // Delete the user account from Firebase Authentication
            await currentUser.delete();
    
            // Clear context or state
            if (context?.clearData) {
                context.clearData();
            }
    
            navigate('/');
    
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    
    

    useEffect(() => {
        window.scrollTo(0, 0);

        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
        } else {
            navigate('/');
        }
    }, [auth, navigate]);

    
    
    const filteredposts = getAllPost.filter(post => post.userId === user?.uid);
   
    return (
        <Layout>
            <div className="py-10">
                <div className="flex flex-wrap justify-start items-center lg:justify-center gap-2 lg:gap-10 px-4 lg:px-0 mb-8">
                    <div className="left">
                        <img
                            className="w-40 h-40 object-cover rounded-full border-2 border-pink-600 p-1"
                            src={'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'}
                            alt="profile"
                        />
                    </div>
                    <div className="right">
                        {user && (
                            <>
                                <h1 className='text-center font-bold text-2xl mb-2' style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                                    {user.displayName || 'User Name'}
                                </h1>
                                <h2 style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">
                                    {user.email || 'user@example.com'}
                                </h2>
                            </>
                        )}
                        <h2 style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">
                            <span>Total post : </span> {filteredposts.length}
                        </h2>
                        <div className="flex gap-2 mt-2">
                            <Link to={'/createpost'}>
                                <div className="mb-2">
                                    <Button
                                        style={{
                                            background: mode === 'dark'
                                                ? 'rgb(226, 232, 240)'
                                                : 'rgb(30, 41, 59)',
                                            color: mode === 'dark'
                                                ? 'black'
                                                : 'white'
                                        }}
                                        className='px-8 py-2'
                                    >
                                        Create post
                                    </Button>
                                </div>
                            </Link>
                            <div className="mb-2">
                                <Button
                                    onClick={logout}
                                    style={{
                                        background: mode === 'dark'
                                            ? 'rgb(226, 232, 240)'
                                            : 'rgb(30, 41, 59)',
                                        color: mode === 'dark'
                                            ? 'black'
                                            : 'white'
                                    }}
                                    className='px-8 py-2'
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line  */}
                <hr className={`border-2 ${mode === 'dark' ? 'border-gray-300' : 'border-gray-400'}`} />

                {/* Table  */}
                <div className="">
                    <div className='container mx-auto px-4 max-w-7xl my-5'>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-xl">
                            {/* Table  */}
                            <table className="w-full border-2 border-white shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
                                {/* Thead  */}
                                <thead
                                    style={{ background: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
                                    className="text-xs">
                                    <tr>
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            S.No
                                        </th>
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Thumbnail
                                        </th>
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Description
                                        </th>
                                       
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Date
                                        </th>
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                {/* Tbody  */}
                                {filteredposts.length > 0  ? (
                                    <>
                                        {filteredposts.map((item, index) => {
                                            console.log(item)
                                            const { thumbnail, date, id } = item;
                                            
                                            return (
                                                <tbody key={index}>
                                                    <tr className="border-b-2" style={{ background: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }}>
                                                        {/* S.No   */}
                                                        <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                            {index + 1}.
                                                        </td>

                                                        {/* post Thumbnail  */}
                                                        <th style={{ color: mode === 'dark' ? 'white' : 'black' }} scope="row" className="px-6 py-4 font-medium">
                                                            {/* Thumbnail  */}
                                                            <img className='w-16 rounded-lg' src={thumbnail} alt="thumbnail" />
                                                        </th>

                                                        {/* post Title  */}
                                                        <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                            {item?.description}
                                                        </td>

                                                      
                                                       

                                                        {/* post Date  */}
                                                        <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                            {date}
                                                        </td>

                                                        {/* Delete post  */}
                                                        <td onClick={() => deleteposts(id)} style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                            <button className='px-4 py-1 rounded-lg text-white font-bold bg-red-500'>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <>
                                        <h1>Not Found</h1>
                                    </>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
