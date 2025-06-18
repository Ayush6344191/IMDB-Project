import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.ts'; 

interface Review {
    id: string;
    author: string;
    content: string;
    timestamp: any; 
    title: string;
}

const ReviewList: React.FC<{ userId: string }> = ({ userId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState<string>('');

    useEffect(() => {
        if (!userId) return;

        const reviewsRef = collection(db, `users/${userId}/reviews`);
        const q = query(reviewsRef, orderBy("timestamp", "desc")); 
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Review[];
            setReviews(fetchedReviews);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const handleEdit = (review: Review) => {
        setEditingReviewId(review.id);
        setEditedContent(review.content);
    };

    const handleSave = async (reviewId: string) => {
        const reviewDocRef = doc(db, 'users', userId, 'reviews', reviewId);
        await updateDoc(reviewDocRef, { content: editedContent });
        setEditingReviewId(null);
    };

    const handleDelete = async (reviewId: string) => {
        const reviewDocRef = doc(db, 'users', userId, 'reviews', reviewId);
        await deleteDoc(reviewDocRef);
    };

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (reviews.length === 0) {
        return <p>No reviews available.</p>;
    }

    return (
        <ul>
            {reviews.map((review) => (
                <li key={review.id} className="bg-gray-600 p-4 rounded mb-2 text-white">
                    <h3 className="text-lg font-bold text-white">{review.title}</h3>
                    <p className="italic text-white">By: {review.author}</p>
                    {editingReviewId === review.id ? (
                        <div>
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full p-2 mb-2 bg-gray-800 text-white"
                            />
                            <button onClick={() => handleSave(review.id)} className="bg-green-500 px-4 py-2 rounded mr-2">
                                Save
                            </button>
                            <button onClick={() => setEditingReviewId(null)} className="bg-red-500 px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <p>{review.content}</p>
                    )}
                    <small className="text-gray-400">
                        {review.timestamp.toDate().toLocaleString()}
                    </small>
                    <div className="mt-2">
                        <button onClick={() => handleEdit(review)} className="bg-blue-500 px-4 py-2 rounded mr-2">
                            Edit
                        </button>
                        <button onClick={() => handleDelete(review.id)} className="bg-red-500 px-4 py-2 rounded">
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ReviewList;