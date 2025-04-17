import { useState, useEffect } from 'react';
import RecordStars from '../../common/RecordStars';
import '../../../styles/components/records/recordDetail.css';
import DefaultRecordImage from '../../../assets/default-record.svg';

const RecordDetailView = ({ record }) => {
  const [imageError, setImageError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初期チェック
    checkMobile();

    // リサイズイベント時に再計算
    window.addEventListener('resize', checkMobile);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 画像パス生成
  const fullImagePath = `/images/record-covers/full-size/record_${record.id}_full.jpeg`;

  // 画像読み込みエラーハンドラー
  const handleImageError = () => {
    setImageError(true);
  };

  // 画像拡大表示を開く
  const openFullImage = () => {
    if (!imageError) {
      setShowFullImage(true);
    }
  };

  // 画像拡大表示を閉じる
  const closeFullImage = () => {
    setShowFullImage(false);
  };

  // 日付のフォーマット
  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // 新しい画像表示のスタイル
  const imageContainerStyle = {
    width: '200px',
    height: '200px',
    overflow: 'hidden',
    borderRadius: '8px',
    flexShrink: 0,
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  };

  return (
    <div className="record-detail-container">
      {/* ヘッダー部分: アルバム情報と画像 */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          marginBottom: '20px',
          alignItems: isMobile ? 'center' : 'flex-start',
          overflow: 'hidden',
        }}
      >
        <div style={imageContainerStyle}>
          <img
            src={imageError ? DefaultRecordImage : fullImagePath}
            alt={`${record.album_name} のジャケット`}
            style={imageStyle}
            onClick={openFullImage}
            onError={handleImageError}
          />
        </div>

        <div
          style={{
            marginTop: isMobile ? '15px' : '0',
            marginLeft: isMobile ? '0' : '20px',
            textAlign: isMobile ? 'center' : 'left',
            flex: 1,
          }}
        >
          <h2 style={{ fontSize: '1.8rem', marginTop: 0, marginBottom: '10px' }}>
            {record.album_name}
          </h2>
          <h3 style={{ fontSize: '1.4rem', marginTop: 0, marginBottom: '6px', fontWeight: '500' }}>
            {record.artist}
          </h3>
          {record.alphabet_artist && (
            <p style={{ fontSize: '0.9rem', marginTop: 0, fontStyle: 'italic', color: '#666' }}>
              {record.alphabet_artist}
            </p>
          )}
          <div
            className="record-rating"
            style={{ justifyContent: isMobile ? 'center' : 'flex-start' }}
          >
            <RecordStars rating={record.star} readOnly />
          </div>
        </div>
      </div>

      <div className="record-sections">
        {/* 基本情報とコレクション情報 */}
        <div className="section-row">
          <div className="record-section">
            <h4 className="section-title">基本情報</h4>
            <table className="info-table">
              <tbody>
                <tr className="info-row">
                  <td className="info-label">ジャンル</td>
                  <td className="info-value">{record.genre || '不明'}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-label">発売年</td>
                  <td className="info-value">{record.release_year || '不明'}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-label">国</td>
                  <td className="info-value">{record.country || '不明'}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-label">サイズ</td>
                  <td className="info-value">{record.size ? `${record.size}"` : '不明'}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-label">コンピレーション</td>
                  <td className="info-value">{record.compilation ? 'はい' : 'いいえ'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="record-section">
            <h4 className="section-title">コレクション情報</h4>
            <table className="info-table">
              <tbody>
                <tr className="info-row">
                  <td className="info-label">取得日</td>
                  <td className="info-value">{formatDate(record.acquisition_date) || '不明'}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-label">保管場所</td>
                  <td className="info-value">{record.storage_location || '不明'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 出版情報とレビュー */}
        <div className="section-row">
          <div className="record-section">
            <h4 className="section-title">出版情報</h4>
            <table className="info-table">
              <tbody>
                <tr className="info-row">
                  <td className="info-label">レーベル</td>
                  <td className="info-value">{record.label || '不明'}</td>
                </tr>
                <tr className="info-row">
                  <td className="info-label">カタログ番号</td>
                  <td className="info-value">{record.catalog_number || '不明'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {record.review && (
            <div className="record-section">
              <h4 className="section-title">レビュー</h4>
              <p className="review-text">{record.review}</p>
            </div>
          )}
        </div>

        {/* 視聴リンク */}
        {record.music_link && (
          <div className="section-row">
            <div className="record-section">
              <h4 className="section-title">試聴リンク</h4>
              <div className="music-link-container">
                <a
                  href={record.music_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="music-link"
                >
                  {record.music_link.includes('spotify')
                    ? 'Spotifyで聴く'
                    : record.music_link.includes('youtube')
                      ? 'YouTubeで見る'
                      : '試聴する'}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 画像拡大モーダル */}
      {showFullImage && (
        <div className="image-modal" onClick={closeFullImage}>
          <img
            src={fullImagePath}
            alt={`${record.album_name} 拡大画像`}
            className="modal-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default RecordDetailView;
