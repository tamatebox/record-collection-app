import React from 'react';
import '../records/detail/RecordDetail.css';

const RecordStars = ({ rating, onChange, readOnly = false }) => {
  const numRating = rating ? parseInt(rating, 10) : 0;

  // 読み取り専用の星を表示
  if (readOnly) {
    return (
      <div className="rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < numRating ? 'star filled' : 'star'}>★</span>
        ))}
      </div>
    );
  }

  // クリック可能な星を表示
  return (
    <div className="rating editable-rating">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={(i + 1) <= numRating ? 'star filled' : 'star'}
          onClick={() => onChange && onChange(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RecordStars;