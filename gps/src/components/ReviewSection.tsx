"use client";

import { useState, useEffect, useCallback } from "react";
import { Review } from "@/types/medical";

interface ReviewSectionProps {
  entityType: "hospital" | "pharmacy";
  entityId: number;
}

export default function ReviewSection({ entityType, entityId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    reviewerName: "",
    rating: 5,
    comment: "",
  });

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/reviews?entityType=${entityType}&entityId=${entityId}`
      );
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entityId, ...form }),
      });
      if (res.ok) {
        setForm({ reviewerName: "", rating: 5, comment: "" });
        setShowForm(false);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number, interactive = false, onSet?: (r: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        onClick={() => interactive && onSet && onSet(i + 1)}
        className={`text-xl ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"} ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`}
      >
        ★
      </span>
    ));
  };

  const timeAgo = (date: Date | null | string) => {
    if (!date) return "";
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <div>
      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            {renderStars(avgRating)}
            <span className="text-lg font-bold text-gray-800 ml-1">{avgRating.toFixed(1)}</span>
          </div>
          <p className="text-xs text-gray-500">{reviews.length} reviews</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Write Review
        </button>
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-blue-50 rounded-xl p-3 mb-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Write a Review</h4>
          <input
            type="text"
            placeholder="Your name"
            value={form.reviewerName}
            onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div>
            <p className="text-xs text-gray-600 mb-1">Rating</p>
            <div className="flex gap-1">
              {renderStars(form.rating, true, (r) => setForm({ ...form, rating: r }))}
            </div>
          </div>
          <textarea
            placeholder="Share your experience..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="text-center py-6 text-gray-400 text-sm">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.reviewerName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{review.reviewerName}</p>
                    <p className="text-xs text-gray-400">{timeAgo(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 mt-1.5">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
