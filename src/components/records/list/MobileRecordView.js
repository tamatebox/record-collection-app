import React from 'react';
import { formatDate } from './utils/RecordUtils';
import DefaultRecordImage from '../../../assets/default-record.svg';
import './styles/MobileRecordView.css';

/**
 * モバイル向けのレコード表示コンポーネント
 * グリッド表示とリスト表示を切り替えられる
 */
const MobileRecordView = ({ records, onRecordSelect, onRecordDelete, viewMode }) => {
  // 画像エラー状態を管理するステート
  const [imageErrors, setImageErrors] = React.useState({});

  // 画像読み込みエラーを処理するハンドラー
  const handleImageError = (recordId) => {
    setImageErrors((prev) => ({
      ...prev,
      [recordId]: true,
    }));
  };

  // 星評価を表示する関数
  const renderStars = (rating) => {
    const stars = [];
    const numRating = rating ? parseInt(rating, 10) : 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < numRating ? 'star filled' : 'star'} aria-hidden="true">
          {i < numRating ? '★' : '☆'}
        </span>
      );
    }

    return (
      <div className="mobile-rating" aria-label={`5段階中${numRating}の評価`}>
        {stars}
      </div>
    );
  };

  if (records.length === 0) {
    return <div className="no-records">条件に一致するレコードがありません</div>;
  }

  return (
    <div className="mobile-records-container">
      {/* グリッド表示 */}
      {viewMode === 'card' && (
        <div className="mobile-grid-view">
          {records.map((record) => {
            const imagePath = record.full_image || null;
            const hasImageError = imageErrors[record.id];

            return (
              <div
                key={record.id}
                className="mobile-grid-item"
                onClick={() => onRecordSelect(record)}
              >
                <div className="mobile-grid-image">
                  <img
                    src={hasImageError || !imagePath ? DefaultRecordImage : imagePath}
                    alt={`${record.album_name}のジャケット`}
                    onError={() => handleImageError(record.id)}
                  />
                </div>
                <div className="mobile-grid-info">
                  <div className="mobile-grid-artist">{record.artist}</div>
                  <div className="mobile-grid-album">{record.album_name}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* リスト表示 */}
      {viewMode === 'table' && (
        <div className="mobile-list-view">
          {records.map((record) => {
            const imagePath = record.full_image || null;
            const hasImageError = imageErrors[record.id];

            return (
              <div key={record.id} className="mobile-list-item">
                <div className="mobile-list-content" onClick={() => onRecordSelect(record)}>
                  <div className="mobile-list-image">
                    <img
                      src={hasImageError || !imagePath ? DefaultRecordImage : imagePath}
                      alt={`${record.album_name}のジャケット`}
                      onError={() => handleImageError(record.id)}
                    />
                  </div>

                  <div className="mobile-list-info">
                    <h3 className="mobile-list-artist">{record.artist}</h3>
                    <h4 className="mobile-list-album">{record.album_name}</h4>

                    <div className="mobile-list-details">
                      <div className="mobile-list-year-genre">
                        <span className="mobile-list-year">{record.release_year || '年不明'}</span>
                        <span className="mobile-list-separator">·</span>
                        <span className="mobile-list-genre">{record.genre || 'ジャンル不明'}</span>
                      </div>
                      <div className="mobile-list-country-size">
                        <span className="mobile-list-country">{record.country || '国不明'}</span>
                        <span className="mobile-list-separator">·</span>
                        <span className="mobile-list-size">{record.size || '?'}"</span>
                      </div>
                      {record.star && (
                        <div className="mobile-list-rating">{renderStars(record.star)}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mobile-list-actions">
                  <button
                    className="mobile-delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('このレコードを削除してもよろしいですか？')) {
                        onRecordDelete(record.id);
                      }
                    }}
                    aria-label={`${record.artist}の${record.album_name}を削除`}
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileRecordView;
