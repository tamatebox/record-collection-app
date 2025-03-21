import React, { useState, useEffect } from 'react';
import './RecordDetail.css';

const RecordDetail = ({ record, onClose, onUpdate, genres = [], countries = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState({ ...record });
  
  // 親コンポーネントからレコードが変更された場合に反映する
  useEffect(() => {
    setEditedRecord({ ...record });
  }, [record]);
  
  // 編集フィールドの変更を処理するハンドラー
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedRecord({
      ...editedRecord,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // 編集モードの切り替え
  const toggleEditMode = () => {
    if (isEditing) {
      // 編集モードのキャンセルなら元のレコードに戻す
      setEditedRecord({ ...record });
    }
    setIsEditing(!isEditing);
  };
  
  // レコードの保存
  const handleSave = async () => {
    try {
      await onUpdate(record.id, editedRecord);
      setIsEditing(false);
    } catch (err) {
      alert('レコードの更新中にエラーが発生しました: ' + err.message);
    }
  };
  // 評価の星を表示する関数
  const renderStars = (rating) => {
    const stars = [];
    const numRating = rating ? parseInt(rating, 10) : 0;
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < numRating ? 'star filled' : 'star'}>★</span>
      );
    }
    
    return <div className="rating">{stars}</div>;
  };
  
  // 編集モードでの評価の星をクリック可能にする
  const renderEditableStars = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i <= parseInt(editedRecord.star || 0, 10) ? 'star filled' : 'star'}
          onClick={() => setEditedRecord({...editedRecord, star: i.toString()})}
        >
          ★
        </span>
      );
    }
    
    return <div className="rating editable-rating">{stars}</div>;
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
    <div className="record-detail-modal">
      <div className="detail-header">
        <h2>{isEditing ? 'レコード編集' : 'レコード詳細'}</h2>
        <div className="header-actions">
          {isEditing ? (
            <>
              <button className="save-button" onClick={handleSave}>保存</button>
              <button className="cancel-button" onClick={toggleEditMode}>キャンセル</button>
            </>
          ) : (
            <button className="edit-button" onClick={toggleEditMode}>編集</button>
          )}
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
      </div>
      
      <div className="detail-content">
        <div className="record-main-info">
          <div className="record-visual">
            <div className="record-disc">
              <div className="record-label"></div>
            </div>
          </div>
          
          <div className="record-titles">
            {isEditing ? (
              <>
                <div className="edit-field">
                  <label htmlFor="album_name">アルバム名</label>
                  <input
                    type="text"
                    id="album_name"
                    name="album_name"
                    value={editedRecord.album_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="edit-field">
                  <label htmlFor="artist">アーティスト名</label>
                  <input
                    type="text"
                    id="artist"
                    name="artist"
                    value={editedRecord.artist}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="edit-field">
                  <label htmlFor="alphabet_artist">アーティスト名(英字)</label>
                  <input
                    type="text"
                    id="alphabet_artist"
                    name="alphabet_artist"
                    value={editedRecord.alphabet_artist || ''}
                    onChange={handleChange}
                  />
                </div>
                {renderEditableStars()}
              </>
            ) : (
              <>
                <h3 className="album-title">{record.album_name}</h3>
                <h4 className="artist-name">{record.artist}</h4>
                {record.alphabet_artist && (
                  <p className="alphabet-artist">{record.alphabet_artist}</p>
                )}
                {renderStars(record.star)}
              </>
            )}
          </div>
        </div>
        
        <div className="detail-columns">
          <div className="detail-column">
            <div className="detail-section">
              <h4 className="section-title">基本情報</h4>
              
              <div className="detail-grid">
                {isEditing ? (
                  <>
                    <div className="detail-item">
                      <label htmlFor="genre">ジャンル</label>
                      <select
                        id="genre"
                        name="genre"
                        value={editedRecord.genre || ''}
                        onChange={handleChange}
                      >
                        <option value="">選択してください</option>
                        {genres.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="detail-item">
                      <label htmlFor="release_year">発売年</label>
                      <input
                        type="text"
                        id="release_year"
                        name="release_year"
                        value={editedRecord.release_year || ''}
                        onChange={handleChange}
                        placeholder="例: 1985"
                      />
                    </div>
                    
                    <div className="detail-item">
                      <label htmlFor="country">国</label>
                      <select
                        id="country"
                        name="country"
                        value={editedRecord.country || ''}
                        onChange={handleChange}
                      >
                        <option value="">選択してください</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="detail-item">
                      <label htmlFor="size">サイズ</label>
                      <select
                        id="size"
                        name="size"
                        value={editedRecord.size || ''}
                        onChange={handleChange}
                      >
                        <option value="7">7"</option>
                        <option value="12">12"</option>
                        <option value="10">10"</option>
                      </select>
                    </div>
                    
                    <div className="detail-item checkbox-item">
                      <label>
                        <input
                          type="checkbox"
                          name="compilation"
                          checked={editedRecord.compilation || false}
                          onChange={handleChange}
                        />
                        コンピレーション
                      </label>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
            
            <div className="detail-section">
              <h4 className="section-title">出版情報</h4>
              
              <div className="detail-grid">
                {isEditing ? (
                  <>
                    <div className="detail-item">
                      <label htmlFor="label">レーベル</label>
                      <input
                        type="text"
                        id="label"
                        name="label"
                        value={editedRecord.label || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="detail-item">
                      <label htmlFor="catalog_number">カタログ番号</label>
                      <input
                        type="text"
                        id="catalog_number"
                        name="catalog_number"
                        value={editedRecord.catalog_number || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <span className="label">レーベル</span>
                      <span className="value">{record.label || '不明'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">カタログ番号</span>
                      <span className="value">{record.catalog_number || '不明'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="detail-column">
            <div className="detail-section">
              <h4 className="section-title">コレクション情報</h4>
              
              <div className="detail-grid">
                {isEditing ? (
                  <>
                    <div className="detail-item">
                      <label htmlFor="acquisition_date">取得日</label>
                      <input
                        type="date"
                        id="acquisition_date"
                        name="acquisition_date"
                        value={editedRecord.acquisition_date || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="detail-item">
                      <label htmlFor="storage_location">保管場所</label>
                      <input
                        type="text"
                        id="storage_location"
                        name="storage_location"
                        value={editedRecord.storage_location || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <span className="label">取得日</span>
                      <span className="value">{formatDate(record.acquisition_date) || '不明'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">保管場所</span>
                      <span className="value">{record.storage_location || '不明'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {(record.review || isEditing) && (
              <div className="detail-section">
                <h4 className="section-title">レビュー</h4>
                {isEditing ? (
                  <textarea
                    id="review"
                    name="review"
                    value={editedRecord.review || ''}
                    onChange={handleChange}
                    rows={4}
                    className="review-textarea"
                  />
                ) : (
                  <p className="review-text">{record.review}</p>
                )}
              </div>
            )}
            
            {(record.music_link || isEditing) && (
              <div className="detail-section">
                <h4 className="section-title">試聴リンク</h4>
                {isEditing ? (
                  <input
                    type="url"
                    id="music_link"
                    name="music_link"
                    value={editedRecord.music_link || ''}
                    onChange={handleChange}
                    placeholder="例: https://open.spotify.com/album/..."
                    className="full-width-input"
                  />
                ) : (
                  <a href={record.music_link} target="_blank" rel="noopener noreferrer" className="music-link">
                    {record.music_link.includes('spotify') ? 'Spotifyで聴く' : 
                     record.music_link.includes('youtube') ? 'YouTubeで見る' : '試聴する'}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
