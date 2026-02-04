import { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from './Rating';
import { useAuth } from '@/context/AuthContext';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewListProps {
  productId: string;
  refreshProduct?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId, refreshProduct }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${apiUrl}/api/products/${productId}/reviews`);
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        setError('Veuillez sélectionner une note');
        return;
    }

    if (!token) {
        setError('Veuillez vous connecter pour laisser un avis');
        return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `${apiUrl}/api/products/${productId}/reviews`,
        { rating, comment },
        config
      );

      setSuccess('Avis soumis avec succès');
      setRating(0);
      setComment('');
      
      // Refresh reviews
      const { data } = await axios.get(`${apiUrl}/api/products/${productId}/reviews`);
      setReviews(data);
      
      if (refreshProduct) refreshProduct();

    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Avis Clients</h2>
      
      {reviews.length === 0 && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded mb-4">
              Aucun avis pour le moment.
          </div>
      )}

      <div className="space-y-4 mb-8">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-4 rounded shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <strong className="text-lg">{review.name}</strong>
                <Rating value={review.rating} />
            </div>
            <div className="text-xs text-gray-500 mb-2">
                {new Date(review.createdAt).toLocaleDateString()}
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Écrire un avis</h3>
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
            </div>
        )}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        )}

        {user ? (
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Note</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gabon-green focus:border-gabon-green p-2"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="">Sélectionner...</option>
                <option value="1">1 - Médiocre</option>
                <option value="2">2 - Passable</option>
                <option value="3">3 - Bien</option>
                <option value="4">4 - Très bien</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Commentaire</label>
              <textarea
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gabon-green focus:border-gabon-green p-2"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gabon-green text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        ) : (
          <div className="bg-yellow-50 p-4 rounded text-yellow-800 border border-yellow-200">
            Veuillez vous <a href={`/login?redirect=/product/${productId}`} className="underline font-bold">connecter</a> pour écrire un avis.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
