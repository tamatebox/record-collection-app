import React, { useState } from 'react';
import './AddRecordForm.css';
import DiscogsSearch from '../../discogs/DiscogsSearch';

const AddRecordForm = ({ onAddRecord, onCancel, genres = [], countries = [] }) => {
  const [formData, setFormData] = useState({
    artist: '',
    album_name: '',
    release_year: '',
    genre: '',
    country: '',
    size: '12',
    label: '',
    compilation: false,
    star: '',
    review: '',
    alphabet_artist: '',
    music_link: '',
    acquisition_date: new Date().toISOString().split('T')[0],
    storage_location: '自宅',
    catalog_number: ''
  });
  
  // Discogsから情報が読み込まれたかを記録
  const [isDiscogsDataLoaded, setIsDiscogsDataLoaded] = useState(false);
  
  // Discogsからレコードの選択があった場合にフォームに反映
  const handleDiscogsSelect = (discogsRecord) => {
    setFormData({
      ...formData,
      ...discogsRecord,
      // compilationはbool型に変換
      compilation: Boolean(discogsRecord.compilation)
    });
    
    // Discogsからデータが読み込まれたことを記録
    setIsDiscogsDataLoaded(true);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecord(formData);
  };

  return (
    <div className="add-record-form">
      <div className="form-header">
        <h2>新しいレコードを追加</h2>
        <button className="close-button" onClick={onCancel}>✕</button>
      </div>
      
      {/* Discogs検索コンポーネント */}
      <DiscogsSearch onSelectRecord={handleDiscogsSelect} />
      
      {/* Discogsからデータが読み込まれた場合の通知 */}
      {isDiscogsDataLoaded && (
        <div className="discogs-data-loaded-notification">
          <i className="check-icon">✓</i> Discogsからレコード情報を取得しました。必要に応じて編集してください。
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="artist">アーティスト名</label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="album_name">アルバム名</label>
            <input
              type="text"
              id="album_name"
              name="album_name"
              value={formData.album_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="release_year">発売年</label>
            <input
              type="text"
              id="release_year"
              name="release_year"
              value={formData.release_year}
              onChange={handleChange}
              placeholder="例: 1985"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="genre">ジャンル</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="country">国</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="size">サイズ</label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
            >
              <option value="7">7"</option>
              <option value="12">12"</option>
              <option value="10">10"</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="label">レーベル</label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="catalog_number">カタログ番号</label>
            <input
              type="text"
              id="catalog_number"
              name="catalog_number"
              value={formData.catalog_number}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="alphabet_artist">アーティスト名(英字)</label>
            <input
              type="text"
              id="alphabet_artist"
              name="alphabet_artist"
              value={formData.alphabet_artist}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="acquisition_date">取得日</label>
            <input
              type="date"
              id="acquisition_date"
              name="acquisition_date"
              value={formData.acquisition_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="storage_location">保管場所</label>
            <input
              type="text"
              id="storage_location"
              name="storage_location"
              value={formData.storage_location}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="star">評価（1-5）</label>
            <select
              id="star"
              name="star"
              value={formData.star}
              onChange={handleChange}
            >
              <option value="">未評価</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="compilation"
                checked={formData.compilation}
                onChange={handleChange}
              />
              コンピレーション
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="music_link">試聴リンク</label>
          <input
            type="url"
            id="music_link"
            name="music_link"
            value={formData.music_link}
            onChange={handleChange}
            placeholder="例: https://open.spotify.com/album/..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="review">レビュー</label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={4}
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            キャンセル
          </button>
          <button type="submit" className="submit-button">
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecordForm;
