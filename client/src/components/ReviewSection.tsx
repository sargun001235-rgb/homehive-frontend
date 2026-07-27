import React, { useEffect, useState } from 'react';
import { useReviewStore } from '../store/useReviewStore';
import { Star, ThumbsUp, CheckCircle, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { reviews, stats, fetchReviews, toggleLike, createReview, total, page, totalPages, isLoading } = useReviewStore();
  const { user } = useAuthStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews(productId);
  }, [productId, fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }
    if (!comment.trim()) {
      toast.error('Comment is required');
      return;
    }

    setSubmitting(true);
    const success = await createReview({
      product: productId,
      rating,
      comment,
      photos: []
    });
    setSubmitting(false);

    if (success) {
      setShowReviewForm(false);
      setComment('');
      setRating(5);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

      {/* Review Stats */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-2xl min-w-[200px]">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
          </div>
          {renderStars(stats?.averageRating || 0)}
          <div className="text-sm text-gray-500 mt-2 font-medium">{total} Reviews</div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats ? (stats as any)[`${star === 5 ? 'five' : star === 4 ? 'four' : star === 3 ? 'three' : star === 2 ? 'two' : 'one'}Star`] : 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center text-sm">
                <span className="w-12 flex items-center font-medium text-gray-600">{star} <Star className="w-3 h-3 ml-1 text-gray-400" /></span>
                <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-10 text-right text-gray-500 font-medium">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">Share your thoughts with other customers and help them make a decision.</p>
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full py-2.5 px-4 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-xl hover:border-gray-900 hover:text-gray-900 transition-colors"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4">Write a Review</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star className={`w-8 h-8 transition-colors ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-3 text-sm"
              placeholder="What did you like or dislike?"
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} className="w-full h-full object-cover" alt={review.user.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500"><User className="w-5 h-5" /></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center">
                      {review.user?.name || 'Anonymous User'}
                      {review.verifiedPurchase && (
                        <span className="ml-2 flex items-center text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-3 mt-3">{review.comment}</p>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => toggleLike(review._id)}
                  className={`flex items-center text-xs font-medium transition-colors ${user && review.likes.includes(user._id) ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 mr-1.5" /> 
                  {review.likes.length > 0 ? review.likes.length : 'Helpful'}
                </button>
              </div>

              {review.sellerResponse && (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl ml-4 md:ml-8 border-l-2 border-primary">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Seller Response</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.sellerResponse}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {page < totalPages && (
        <div className="mt-8 text-center">
          <button 
            onClick={() => fetchReviews(productId, page + 1)}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
