import { useState } from 'react';
// スタイルはすでにglobal.cssに含まれています

/**
 * 星評価コンポーネント
 * @param {number} rating - 現在の評価値 (1-5)
 * @param {function} onChange - 評価変更時のコールバック関数
 * @param {boolean} readOnly - 読み取り専用モードかどうか
 */
const RecordStars = ({ rating, onChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const numRating = rating ? parseInt(rating, 10) : 0;

  // 読み取り専用の星を表示
  if (readOnly) {
    return (
      <div className="rating" aria-label={`${numRating}星評価（5段階中）`}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < numRating ? 'star filled' : 'star'} aria-hidden="true">
            ★
          </span>
        ))}
      </div>
    );
  }

  // クリック可能な星を表示
  return (
    <div
      className="rating editable-rating"
      onMouseLeave={() => setHoverRating(0)}
      aria-label="評価を選択（5段階）"
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={(hoverRating > 0 ? i < hoverRating : i < numRating) ? 'star filled' : 'star'}
          onClick={() => onChange && onChange(i + 1)}
          onMouseEnter={() => setHoverRating(i + 1)}
          tabIndex="0"
          role="button"
          aria-label={`${i + 1}星の評価を設定`}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onChange && onChange(i + 1);
            }
          }}
        >
          ★
        </span>
      ))}
      {numRating > 0 && (
        <span className="rating-value" aria-hidden="true">
          ({numRating})
        </span>
      )}
    </div>
  );
};

export default RecordStars;
