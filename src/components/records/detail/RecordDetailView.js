import React, { useState } from 'react';
import RecordStars from '../../common/RecordStars';
import './RecordDetail.css';
import DefaultRecordImage from '../../../assets/default-record.svg';

const RecordDetailView = ({ record }) => {
  const [imageError, setImageError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  // 画像パス生成
  const fullImagePath = `/images/record-covers/full-size/record_${record.id}_full.jpeg`;

  // 画像読み込みエラーハンドラー
  const handleImageError = () => {
    setImageError(true);
  };

  // 画像拡大モーダルの表示/非表示トグル
  const toggleFullImage = () => {
    if (!imageError) {
      setShowFullImage(!showFullImage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <div className="record-main-info">
        <div className="record-visual">
          <div className="record-image-container">
            <img
              src={imageError ? DefaultRecordImage : fullImagePath}
              alt={`${record.album_name} album cover`}
              className="record-detail-image"
              onClick={!imageError ? toggleFullImage : undefined}
              onError={handleImageError}
            />
          </div>
        </div>

        <div className="record-titles">
          <h3 className="album-title">{record.album_name}</h3>
          <h4 className="artist-name">{record.artist}</h4>
          {record.alphabet_artist && (
            <p className="alphabet-artist">{record.alphabet_artist}</p>
          )}
          <RecordStars rating={record.star} readOnly />
        </div>
      </div>

      {/* 画像拡大モーダル */}
      {showFullImage && !imageError && (
        <div className="image-modal" onClick={toggleFullImage}>
          <img
            src={fullImagePath}
            alt={`${record.album_name} full size`}
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="detail-columns">
        <div className="detail-column">
          <div className="detail-section">
            <h4 className="section-title">基本情報</h4>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">ジャンル</span>
                <span className="value">{record.genre || '不明'}</span>
              </div>

              <div className="detail-item">
                <span className="label">発売年</span>
                <span className="value">{record.release_year || '不明'}</span>
              </div>

              <div className="detail-item">
                <span className="label">国</span>
                <span className="value">{record.country || '不明'}</span>
              </div>

              <div className="detail-item">
                <span className="label">サイズ</span>
                <span className="value">{record.size ? `${record.size}"` : '不明'}</span>
              </div>

              <div className="detail-item">
                <span className="label">コンピレーション</span>
                <span className="value">{record.compilation ? 'はい' : 'いいえ'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4 className="section-title">出版情報</h4>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">レーベル</span>
                <span className="value">{record.label || '不明'}</span>
              </div>

              <div className="detail-item">
                <span className="label">カタログ番号</span>
                <span className="value">{record.catalog_number || '不明'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-column">
          <div className="detail-section">
            <h4 className="section-title">コレクション情報</h4>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">取得日</span>
                <span className="value">{formatDate(record.acquisition_date) || '不明'}</span>
              </div>

              <div className="detail-item">
                <span className="label">保管場所</span>
                <span className="value">{record.storage_location || '不明'}</span>
              </div>
            </div>
          </div>

          {record.review && (
            <div className="detail-section">
              <h4 className="section-title">レビュー</h4>
              <p className="review-text">{record.review}</p>
            </div>
          )}

          {record.music_link && (
            <div className="detail-section">
              <h4 className="section-title">試聴リンク</h4>
              <a href={record.music_link} target="_blank" rel="noopener noreferrer" className="music-link">
                {record.music_link.includes('spotify') ? 'Spotifyで聴く' :
                 record.music_link.includes('youtube') ? 'YouTubeで見る' : '試聴する'}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecordDetailView;