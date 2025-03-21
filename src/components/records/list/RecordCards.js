import React, { useState } from 'react';
import { formatDate, renderStars, NoRecordsMessage } from './utils/RecordUtils';
import DefaultRecordImage from '../../../assets/default-record.svg';

/**
 * レコードのカード表示コンポーネント
 */
const RecordCards = ({
  records,
  onRecordSelect,
  onRecordDelete
}) => {
  // 画像エラー状態を管理するステート
  const [imageErrors, setImageErrors] = useState({});

  // 画像読み込みエラーを処理するハンドラー
  const handleImageError = (recordId) => {
    setImageErrors(prev => ({
      ...prev,
      [recordId]: true
    }));
  };

  if (records.length === 0) {
    return <NoRecordsMessage />;
  }

  return (
    <div className="record-cards">
      {records.map(record => {
        // サムネイル画像パスを生成
        const thumbnailPath = `/images/record-covers/full-size/record_${record.id}_full.jpeg`;
        const hasImageError = imageErrors[record.id];

        return (
          <div
            key={record.id}
            className="record-card"
            onClick={() => onRecordSelect(record)}
            role="button"
            tabIndex="0"
            aria-label={`${record.artist}の${record.album_name}を選択`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onRecordSelect(record);
              }
            }}
          >
            <div className="record-card-image">
              <img
                src={hasImageError ? DefaultRecordImage : thumbnailPath}
                alt={`${record.album_name}のジャケット`}
                className="card-cover-image"
                onError={() => handleImageError(record.id)}
              />
            </div>

            <div className="record-card-header">
              <h3 className="record-artist">{record.artist}</h3>
              {renderStars(record.star)}
            </div>

            <div className="record-card-content">
              <h4 className="record-album">{record.album_name}</h4>

              <div className="record-info">
                <div className="record-detail">
                  <span className="record-year">{record.release_year || '不明'}</span>
                  <span className="record-separator" aria-hidden="true">·</span>
                  <span className="record-genre">{record.genre || '不明'}</span>
                </div>

                <div className="record-detail">
                  <span className="record-country">{record.country || '不明'}</span>
                  <span className="record-separator" aria-hidden="true">·</span>
                  <span className="record-size">{record.size}"</span>
                </div>

                <div className="record-date">
                  追加日: {formatDate(record.acquisition_date)}
                </div>
              </div>
            </div>

            <div className="record-card-actions">
              <button
                className="delete-button"
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
  );
};

export default RecordCards;