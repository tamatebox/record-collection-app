import React, { useState } from 'react';
import RecordStars from '../../common/RecordStars';
import './styles/RecordDetail.css';
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

  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      {/* ヘッダー部分: アルバム情報と画像 */}
      <div
        style={{
          display: 'flex',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <div style={{ marginRight: '20px', flexShrink: 0 }}>
          <img
            src={imageError ? DefaultRecordImage : fullImagePath}
            alt={`${record.album_name} のジャケット`}
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'cover',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
            onClick={openFullImage}
            onError={handleImageError}
          />
        </div>
        <div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{record.album_name}</h2>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: '500', color: '#444' }}>
            {record.artist}
          </h3>
          {record.alphabet_artist && (
            <p
              style={{
                margin: '0 0 10px 0',
                fontStyle: 'italic',
                color: '#666',
                fontSize: '0.9rem',
              }}
            >
              {record.alphabet_artist}
            </p>
          )}
          <div>
            <RecordStars rating={record.star} readOnly />
          </div>
        </div>
      </div>

      {/* メイン情報エリア - 2カラムレイアウト */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* 左カラム: 基本情報 */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '15px',
            border: '1px solid #eee',
          }}
        >
          <h4
            style={{
              borderBottom: '1px solid #ddd',
              paddingBottom: '8px',
              marginTop: 0,
              fontSize: '1rem',
            }}
          >
            基本情報
          </h4>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ color: '#666', padding: '5px 0', width: '120px' }}>ジャンル</td>
                <td style={{ padding: '5px 0' }}>{record.genre || '不明'}</td>
              </tr>
              <tr>
                <td style={{ color: '#666', padding: '5px 0' }}>発売年</td>
                <td style={{ padding: '5px 0' }}>{record.release_year || '不明'}</td>
              </tr>
              <tr>
                <td style={{ color: '#666', padding: '5px 0' }}>国</td>
                <td style={{ padding: '5px 0' }}>{record.country || '不明'}</td>
              </tr>
              <tr>
                <td style={{ color: '#666', padding: '5px 0' }}>サイズ</td>
                <td style={{ padding: '5px 0' }}>{record.size ? `${record.size}"` : '不明'}</td>
              </tr>
              <tr>
                <td style={{ color: '#666', padding: '5px 0' }}>コンピレーション</td>
                <td style={{ padding: '5px 0' }}>{record.compilation ? 'はい' : 'いいえ'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 右カラム: コレクション情報 */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '15px',
            border: '1px solid #eee',
          }}
        >
          <h4
            style={{
              borderBottom: '1px solid #ddd',
              paddingBottom: '8px',
              marginTop: 0,
              fontSize: '1rem',
            }}
          >
            コレクション情報
          </h4>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ color: '#666', padding: '5px 0', width: '120px' }}>取得日</td>
                <td style={{ padding: '5px 0' }}>
                  {formatDate(record.acquisition_date) || '不明'}
                </td>
              </tr>
              <tr>
                <td style={{ color: '#666', padding: '5px 0' }}>保管場所</td>
                <td style={{ padding: '5px 0' }}>{record.storage_location || '不明'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 下段情報エリア - 2カラムレイアウト */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* 左カラム: 出版情報 */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '15px',
            border: '1px solid #eee',
          }}
        >
          <h4
            style={{
              borderBottom: '1px solid #ddd',
              paddingBottom: '8px',
              marginTop: 0,
              fontSize: '1rem',
            }}
          >
            出版情報
          </h4>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ color: '#666', padding: '5px 0', width: '120px' }}>レーベル</td>
                <td style={{ padding: '5px 0' }}>{record.label || '不明'}</td>
              </tr>
              <tr>
                <td style={{ color: '#666', padding: '5px 0' }}>カタログ番号</td>
                <td style={{ padding: '5px 0' }}>{record.catalog_number || '不明'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 右カラム: レビュー（存在する場合） */}
        {record.review && (
          <div
            style={{
              flex: 1,
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '15px',
              border: '1px solid #eee',
            }}
          >
            <h4
              style={{
                borderBottom: '1px solid #ddd',
                paddingBottom: '8px',
                marginTop: 0,
                fontSize: '1rem',
              }}
            >
              レビュー
            </h4>
            <p
              style={{
                margin: '10px 0',
                lineHeight: '1.6',
                fontSize: '0.95rem',
                whiteSpace: 'pre-line',
              }}
            >
              {record.review}
            </p>
          </div>
        )}
      </div>

      {/* 視聴リンク（存在する場合） */}
      {record.music_link && (
        <div
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '15px',
            border: '1px solid #eee',
            marginBottom: '20px',
          }}
        >
          <h4
            style={{
              borderBottom: '1px solid #ddd',
              paddingBottom: '8px',
              marginTop: 0,
              fontSize: '1rem',
            }}
          >
            試聴リンク
          </h4>
          <div style={{ padding: '10px 0' }}>
            <a
              href={record.music_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: '#1db954', // Spotify緑
                color: 'white',
                textDecoration: 'none',
                borderRadius: '20px',
                fontWeight: '500',
                fontSize: '0.9rem',
                boxShadow: '0 2px 4px rgba(29, 185, 84, 0.2)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#18a046';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(29, 185, 84, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1db954';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(29, 185, 84, 0.2)';
              }}
            >
              {record.music_link.includes('spotify')
                ? 'Spotifyで聴く'
                : record.music_link.includes('youtube')
                  ? 'YouTubeで見る'
                  : '試聴する'}
            </a>
          </div>
        </div>
      )}

      {/* 画像拡大モーダル */}
      {showFullImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer',
          }}
          onClick={closeFullImage}
        >
          <img
            src={fullImagePath}
            alt={`${record.album_name} 拡大画像`}
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain',
              borderRadius: '4px',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default RecordDetailView;
