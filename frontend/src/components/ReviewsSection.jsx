import { useState } from 'react';
import { Star, Edit3, Trash2, X, User, Calendar, Edit } from 'lucide-react';
import * as userService from '../service/userService';

export default function ReviewsSection({ reviews, variant = 'user', onReviewUpdate }) {
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  // For vendor variant: reviews are received from users
  // For user variant: reviews are given to vendors (with edit/delete capability)

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment('');
  };

  const handleSaveEdit = async () => {
    if (!editingReview || editRating === 0) return;
    
    try {
      const res = await userService.updateReview(editingReview, {
        rating: editRating,
        comment: editComment
      });
      if (res.success) {
        if (onReviewUpdate) onReviewUpdate(res.review);
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const res = await userService.deleteReview(reviewId);
      if (res.success) {
        if (onReviewUpdate) onReviewUpdate(null, reviewId);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const renderStars = (rating, interactive = false, size = 16) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= (interactive ? (hoveredStar || editRating) : rating) ? '#f59e0b' : '#e2e8f0'}
            color={star <= (interactive ? (hoveredStar || editRating) : rating) ? '#f59e0b' : '#cbd5e1'}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              transition: '0.1s'
            }}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            onClick={() => interactive && setEditRating(star)}
          />
        ))}
      </div>
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#94a3b8', 
        background: '#f8fafc', 
        borderRadius: '16px', 
        border: '1px dashed #cbd5e1' 
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          background: '#e2e8f0', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 1rem auto' 
        }}>
          <Star size={24} color="#94a3b8" />
        </div>
        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {variant === 'user' ? 'No reviews given yet' : 'No reviews received yet'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {reviews.map((review) => (
        <div 
          key={review._id} 
          style={{ 
            background: 'white', 
            padding: '1.25rem', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0',
            transition: '0.2s'
          }}
        >
          {editingReview === review._id ? (
            // Edit Mode
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                  Your Rating
                </label>
                {renderStars(editRating, true, 24)}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                  Comment
                </label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Write your review..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {variant === 'user' ? (
                    // Show vendor info for user's given reviews
                    review.vendorId && (
                      <>
                        <img 
                          src={review.vendorId.profileImage || `https://ui-avatars.com/api/?name=${review.vendorId.fullName}&background=4f46e5&color=fff`}
                          alt={review.vendorId.fullName}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9375rem' }}>
                            {review.vendorId.fullName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {review.vendorId.category || 'Service Provider'}
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    // Show user info for vendor's received reviews
                    review.userId && (
                      <>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: '#eef2ff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <User size={20} color="#4f46e5" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9375rem' }}>
                            {review.userId.fullName}
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
                
                {/* Action buttons for user variant */}
                {variant === 'user' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(review)}
                      style={{
                        padding: '0.5rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: '0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      style={{
                        padding: '0.5rem',
                        background: '#fff1f2',
                        border: '1px solid #fecdd3',
                        borderRadius: '8px',
                        color: '#e11d48',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: '0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#ffe4e6'}
                      onMouseOut={e => e.currentTarget.style.background = '#fff1f2'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                {renderStars(review.rating)}
              </div>

              {review.comment && (
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#64748b', 
                  lineHeight: '1.5',
                  marginBottom: '0.75rem'
                }}>
                  {review.comment}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <Calendar size={12} />
                {new Date(review.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}