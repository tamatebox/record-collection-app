import React, { useState } from 'react';
import DiscogsSearch from '../../discogs/DiscogsSearch';
import RecordStars from '../../common/RecordStars';
import './RecordForm.css';

// 入力フィールドコンポーネント
const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
}) => (
  <div className="detail-item">
    <label htmlFor={id} className={required ? 'required' : ''}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value || ''}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      aria-required={required}
    />
  </div>
);

// セレクトフィールドコンポーネント
const SelectField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options, 
  required = false,
  emptyOption = '選択してください' 
}) => (
  <div className="detail-item">
    <label htmlFor={id} className={required ? 'required' : ''}>
      {label}
    </label>
    <select 
      id={id} 
      name={id} 
      value={value || ''} 
      onChange={onChange}
      required={required}
      aria-required={required}
    >
      {emptyOption && <option value="">{emptyOption}</option>}
      {options.map((option) =>
        typeof option === 'object' ? (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ) : (
          <option key={option} value={option}>
            {option}
          </option>
        )
      )}
    </select>
  </div>
);

// チェックボックスフィールドコンポーネント
const CheckboxField = ({ id, label, checked, onChange }) => (
  <div className="detail-item checkbox-item">
    <label>
      <input 
        type="checkbox" 
        name={id} 
        checked={checked || false} 
        onChange={onChange} 
        id={id}
      />
      {label}
    </label>
  </div>
);

// サイズオプション
const SIZE_OPTIONS = [
  { value: '7', label: '7"' },
  { value: '10', label: '10"' },
  { value: '12', label: '12"' },
];

// デフォルトの初期状態
const getDefaultInitialState = () => ({
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
  catalog_number: '',
});

const RecordForm = ({
  mode = 'add',
  initialRecord = null,
  onSubmit,
  onCancel,
  genres = [],
  countries = [],
  isDiscogsAvailable = false,
}) => {
  // 初期状態の設定
  const [formData, setFormData] = useState(
    mode === 'edit' && initialRecord ? { ...initialRecord } : getDefaultInitialState()
  );

  // Discogsから情報が読み込まれたかを記録
  const [isDiscogsDataLoaded, setIsDiscogsDataLoaded] = useState(false);

  // Discogsからレコードの選択があった場合にフォームに反映
  const handleDiscogsSelect = (discogsRecord) => {
    setFormData((prev) => ({
      ...prev,
      ...discogsRecord,
      compilation: Boolean(discogsRecord.compilation),
    }));

    // Discogsからデータが読み込まれたことを記録
    setIsDiscogsDataLoaded(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 星評価の変更を処理するハンドラー
  const handleStarChange = (rating) => {
    setFormData({
      ...formData,
      star: rating.toString(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id="record-form" onSubmit={handleSubmit} className="record-form-content">
      {isDiscogsAvailable && (
        <div className="discogs-search-section">
          <DiscogsSearch onSelectRecord={handleDiscogsSelect} onCancel={null} />
        </div>
      )}

      {isDiscogsDataLoaded && (
        <div className="discogs-data-loaded-notification">
          <i className="check-icon">✓</i>{' '}
          Discogsからレコード情報を取得しました。必要に応じて編集してください。
        </div>
      )}

      <div className="record-main-info">
        <div className="record-visual">
          <div className="record-disc">
            <div className="record-label"></div>
          </div>
        </div>

        <div className="record-titles">
          <InputField
            id="artist"
            label="アーティスト名"
            value={formData.artist}
            onChange={handleChange}
            required={true}
          />
          <InputField
            id="album_name"
            label="アルバム名"
            value={formData.album_name}
            onChange={handleChange}
            required={true}
          />
          <InputField
            id="alphabet_artist"
            label="アーティスト名(英字)"
            value={formData.alphabet_artist}
            onChange={handleChange}
          />
          <div className="rating-container">
            <label>評価</label>
            <RecordStars rating={formData.star} onChange={handleStarChange} />
          </div>
        </div>
      </div>

      <div className="detail-columns">
        <div className="detail-column">
          <div className="detail-section">
            <h4 className="section-title">基本情報</h4>
            <div className="detail-grid">
              <SelectField
                id="genre"
                label="ジャンル"
                value={formData.genre}
                onChange={handleChange}
                options={genres}
              />
              <InputField
                id="release_year"
                label="発売年"
                value={formData.release_year}
                onChange={handleChange}
                placeholder="例: 1985"
              />
              <SelectField
                id="country"
                label="国"
                value={formData.country}
                onChange={handleChange}
                options={countries}
              />
              <SelectField
                id="size"
                label="サイズ"
                value={formData.size}
                onChange={handleChange}
                options={SIZE_OPTIONS}
                emptyOption={null}
              />
              <CheckboxField
                id="compilation"
                label="コンピレーション"
                checked={formData.compilation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="detail-section">
            <h4 className="section-title">出版情報</h4>
            <div className="detail-grid">
              <InputField
                id="label"
                label="レーベル"
                value={formData.label}
                onChange={handleChange}
              />
              <InputField
                id="catalog_number"
                label="カタログ番号"
                value={formData.catalog_number}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="detail-column">
          <div className="detail-section">
            <h4 className="section-title">コレクション情報</h4>
            <div className="detail-grid">
              <InputField
                id="acquisition_date"
                label="取得日"
                type="date"
                value={formData.acquisition_date}
                onChange={handleChange}
              />
              <InputField
                id="storage_location"
                label="保管場所"
                value={formData.storage_location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="detail-section">
            <h4 className="section-title">レビュー</h4>
            <textarea
              id="review"
              name="review"
              value={formData.review || ''}
              onChange={handleChange}
              rows={4}
              className="review-textarea"
              placeholder="レコードについての感想や詳細を入力"
            />
          </div>

          <div className="detail-section">
            <h4 className="section-title">試聴リンク</h4>
            <input
              type="url"
              id="music_link"
              name="music_link"
              value={formData.music_link || ''}
              onChange={handleChange}
              placeholder="例: https://open.spotify.com/album/..."
              className="full-width-input"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default RecordForm;
