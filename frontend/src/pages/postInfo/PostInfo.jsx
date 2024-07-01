import { Button } from '@material-tailwind/react';
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import myContext from '../../context/data/MyContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import Layout from '../../components/layout/Layout';

function PostInfo() {
  const context = useContext(myContext);
  const { mode } = context;
  const [postData, setPostData] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [dislikeCounts, setDislikeCounts] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchPostData = async () => {
      const docRef = doc(fireDb, 'postPost', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPostData(docSnap.data());
        setLikeCounts({ [id]: docSnap.data().likes || 0 });
        setDislikeCounts({ [id]: docSnap.data().dislikes || 0 });
        setComments({ [id]: docSnap.data().comments || [] });
      }
    };
    fetchPostData();
  }, [id]);

  const handleLike = async () => {
    const docRef = doc(fireDb, 'postPost', id);
    await updateDoc(docRef, {
      likes: (likeCounts[id] || 0) + 1
    });
    setLikeCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDislike = async () => {
    const docRef = doc(fireDb, 'postPost', id);
    await updateDoc(docRef, {
      dislikes: (dislikeCounts[id] || 0) + 1
    });
    setDislikeCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    const docRef = doc(fireDb, 'postPost', id);
    const currentComments = comments[id] || [];
    await updateDoc(docRef, {
      comments: [...currentComments, { text: newComment, likes: 0, dislikes: 0 }]
    });
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { text: newComment, likes: 0, dislikes: 0 }]
    }));
    setNewComment('');
  };

  const handleCommentLike = async (commentIndex) => {
    const docRef = doc(fireDb, 'postPost', id);
    const currentComments = comments[id] || [];
    const updatedComments = [...currentComments];
    updatedComments[commentIndex] = {
      ...updatedComments[commentIndex],
      likes: (updatedComments[commentIndex].likes || 0) + 1
    };
    await updateDoc(docRef, {
      comments: updatedComments
    });
    setComments((prev) => ({
      ...prev,
      [id]: updatedComments
    }));
  };

  const handleCommentDislike = async (commentIndex) => {
    const docRef = doc(fireDb, 'postPost', id);
    const currentComments = comments[id] || [];
    const updatedComments = [...currentComments];
    updatedComments[commentIndex] = {
      ...updatedComments[commentIndex],
      dislikes: (updatedComments[commentIndex].dislikes || 0) + 1
    };
    await updateDoc(docRef, {
      comments: updatedComments
    });
    setComments((prev) => ({
      ...prev,
      [id]: updatedComments
    }));
  };

  return (
    <Layout>
      {postData ? (
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-10 mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-center mb-5">
              <div className="p-4 md:w-1/2">
                <div
                  style={{
                    background: mode === 'dark'
                      ? 'rgb(30, 41, 59)'
                      : 'white',
                    borderBottom: mode === 'dark'
                      ? '4px solid rgb(226, 232, 240)'
                      : '4px solid rgb(30, 41, 59)',
                  }}
                  className={`h-full shadow-lg ${mode === 'dark' ? 'shadow-gray-700' : 'shadow-xl'} rounded-xl overflow-hidden`}
                >
                  <img className="w-full" src={postData.thumbnail} alt="post" />
                  <div className="p-6">
                    <h2
                      className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
                      style={{
                        color: mode === 'dark'
                          ? 'rgb(226, 232, 240)'
                          : 'rgb(30, 41, 59)',
                      }}
                    >
                      {postData.date}
                    </h2>
                    <p
                      className="leading-relaxed mb-3"
                      style={{
                        color: mode === 'dark'
                          ? 'rgb(226, 232, 240)'
                          : 'rgb(30, 41, 59)',
                      }}
                    >
                      {postData.description}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <Button
                          onClick={handleLike}
                          className="mr-2"
                        >
                          👍 {likeCounts[id] || 0}
                        </Button>
                        <Button
                          onClick={handleDislike}
                          className="mr-2"
                        >
                          👎 {dislikeCounts[id] || 0}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <textarea
                        className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none mb-2"
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button
                        onClick={handleAddComment}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Add Comment
                      </Button>
                      {comments[id] && comments[id].length > 0 && (
                        <ul className="mt-2">
                          {comments[id].map((comment, commentIndex) => (
                            <li key={commentIndex} className="mb-2">
                              <div className="flex justify-between items-center">
                                <span>{comment.text}</span>
                                <div className="flex items-center">
                                  <Button
                                    onClick={() => handleCommentLike(commentIndex)}
                                    className="mr-2 text-xs"
                                  >
                                    👍 {comment.likes || 0}
                                  </Button>
                                  <Button
                                    onClick={() => handleCommentDislike(commentIndex)}
                                    className="mr-2 text-xs"
                                  >
                                    👎 {comment.dislikes || 0}
                                  </Button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
}

export default PostInfo;