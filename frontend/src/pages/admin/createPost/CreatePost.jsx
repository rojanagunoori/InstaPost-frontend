import React, { useContext, useState } from 'react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import MyContext from '../../../context/data/MyContext';
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fireDb, storage } from '../../../firebase/FirebaseConfig';
//import SocketContext from '../../../context/data/SocketContext'; // Import SocketContext
import socket from '../../../socket/socket';

function Createpost() {
    const context = useContext(MyContext);
    //const socket = useContext(SocketContext); // Use SocketContext
    const { mode, user } = context; // Get user from context
    const navigate = useNavigate();

    const [posts, setposts] = useState({
        description: '',
        time: Timestamp.now(),
        likes: 0,
        dislikes: 0,
        comments: []
    });
    const [thumbnail, setThumbnail] = useState();

    const addPost = async () => {
        if (posts.description === "" || !thumbnail) {
            toast.error('Please Fill All Fields');
            return;
        }
        uploadImage();
    }

    const uploadImage = () => {
        if (!thumbnail) return;
        const imageRef = ref(storage, `postimage/${thumbnail.name}`);
        uploadBytes(imageRef, thumbnail).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                const productRef = collection(fireDb, "postPost");
                try {
                    addDoc(productRef, {
                        ...posts,
                        thumbnail: url,
                        userId: user?.uid,
                        time: Timestamp.now(),
                        date: new Date().toLocaleString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        })
                    });
                    socket.emit('new post', {
                        user: user?.displayName || user?.email,
                        description: posts.description
                    }); // Emit the new post event
                    navigate('/dashboard');
                    toast.success('Post Added Successfully');
                } catch (error) {
                    toast.error('Error adding post');
                    console.log(error);
                }
            });
        });
    }

    return (
        <div className='container mx-auto max-w-5xl py-6'>
            <div className="p-5" style={{
                background: mode === 'dark'
                    ? '#353b48'
                    : 'rgb(226, 232, 240)',
                borderBottom: mode === 'dark'
                    ? '4px solid rgb(226, 232, 240)'
                    : '4px solid rgb(30, 41, 59)'
            }}>
                <div className="mb-2 flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Link to={'/dashboard'}>
                            <BsFillArrowLeftCircleFill size={25} />
                        </Link>
                        <Typography
                            variant="h4"
                            style={{
                                color: mode === 'dark'
                                    ? 'white'
                                    : 'black'
                            }}
                        >
                            Create post
                        </Typography>
                    </div>
                </div>
                <div className="mb-3">
                    {thumbnail && <img className="w-full rounded-md mb-3" src={thumbnail ? URL.createObjectURL(thumbnail) : ""} alt="thumbnail" />}
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-semibold"
                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                        Upload Thumbnail
                    </Typography>
                    <input
                        type="file"
                        className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                </div>
                <div className="mb-3">
                    <input
                        className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none ${mode === 'dark' ? 'placeholder-black' : 'placeholder-black'}`}
                        placeholder="Enter Your Description"
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        name="description"
                        onChange={(e) => setposts({ ...posts, description: e.target.value })}
                        value={posts.description}
                    />
                </div>
                <Button className="w-full mt-5"
                    onClick={addPost}
                    style={{
                        background: mode === 'dark'
                            ? 'rgb(226, 232, 240)'
                            : 'rgb(30, 41, 59)',
                        color: mode === 'dark'
                            ? 'rgb(30, 41, 59)'
                            : 'rgb(226, 232, 240)'
                    }}
                >
                    Send
                </Button>
            </div>
        </div>
    )
}

export default Createpost;
