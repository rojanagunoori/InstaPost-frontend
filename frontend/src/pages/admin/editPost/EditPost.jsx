import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import Layout from '../../../components/layout/Layout';
import { getAuth } from 'firebase/auth';

function EditPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const fetchPost = async () => {
            const docRef = doc(db, 'postPost', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPost(docSnap.data());
                setDescription(docSnap.data().description);
            } else {
                console.error("No such document!");
            }
        };
        fetchPost();
    }, [id, db]);

    const handleUpdate = async () => {
        if (post) {
            const docRef = doc(db, 'postPost', id);
            await updateDoc(docRef, { description });
            navigate('/dashboard');
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 max-w-7xl my-5">
                {post ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            onClick={handleUpdate}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Update Post
                        </button>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </Layout>
    );
}

export default EditPost;
