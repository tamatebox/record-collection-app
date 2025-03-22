import React from 'react';
import RecordStars from '../../common/RecordStars';
import './RecordDetail.css';

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
  <div className="edit-field">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={value || ''}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

// セレクトフィールドコンポーネント
const SelectField = ({ id, label, value, onChange, options, emptyOption = '選択してください' }) => (
  <div className="detail-item">
    <label htmlFor={id}>{label}</label>
    <select id={id} name={id} value={value || ''} onChange={onChange}>
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
      <input type="checkbox" name={id} checked={checked || false} onChange={onChange} />
      {label}
    </label>
  </div>
);

// セクションコンポーネント
const Section = ({ title, children }) => (
  <div className="detail-section">
    <h4 className="section-title">{title}</h4>
    <div className="detail-grid">{children}</div>
  </div>
);

const RecordEdit = ({ record, onChange, onStarChange, genres = [], countries = [] }) => {
  // サイズオプションの定義
  const sizeOptions = [
    { value: '7', label: '7"' },
    { value: '10', label: '10"' },
    { value: '12', label: '12"' },
  ];

  return (
    <>
      <div className="record-main-info">
        <div className="record-visual">
          <div className="record-disc">
            <div className="record-label"></div>
          </div>
        </div>

        <div className="record-titles">
          <InputField
            id="album_name"
            label="アルバム名"
            value={record.album_name}
            onChange={onChange}
            required={true}
          />
          <InputField
            id="artist"
            label="アーティスト名"
            value={record.artist}
            onChange={onChange}
            required={true}
          />
          <InputField
            id="alphabet_artist"
            label="アーティスト名(英字)"
            value={record.alphabet_artist}
            onChange={onChange}
          />
          <RecordStars rating={record.star} onChange={onStarChange} />
        </div>
      </div>

      <div className="detail-columns">
        <div className="detail-column">
          <Section title="基本情報">
            <SelectField
              id="genre"
              label="ジャンル"
              value={record.genre}
              onChange={onChange}
              options={genres}
            />
            <InputField
              id="release_year"
              label="発売年"
              value={record.release_year}
              onChange={onChange}
              placeholder="例: 1985"
            />
            <SelectField
              id="country"
              label="国"
              value={record.country}
              onChange={onChange}
              options={countries}
            />
            <SelectField
              id="size"
              label="サイズ"
              value={record.size}
              onChange={onChange}
              options={sizeOptions}
              emptyOption={null}
            />
            <CheckboxField
              id="compilation"
              label="コンピレーション"
              checked={record.compilation}
              onChange={onChange}
            />
          </Section>

          <Section title="出版情報">
            <InputField id="label" label="レーベル" value={record.label} onChange={onChange} />
            <InputField
              id="catalog_number"
              label="カタログ番号"
              value={record.catalog_number}
              onChange={onChange}
            />
          </Section>
        </div>

        <div className="detail-column">
          <Section title="コレクション情報">
            <InputField
              id="acquisition_date"
              label="取得日"
              type="date"
              value={record.acquisition_date}
              onChange={onChange}
            />
            <InputField
              id="storage_location"
              label="保管場所"
              value={record.storage_location}
              onChange={onChange}
            />
          </Section>

          <div className="detail-section">
            <h4 className="section-title">レビュー</h4>
            <textarea
              id="review"
              name="review"
              value={record.review || ''}
              onChange={onChange}
              rows={4}
              className="review-textarea"
            />
          </div>

          <div className="detail-section">
            <h4 className="section-title">試聴リンク</h4>
            <input
              type="url"
              id="music_link"
              name="music_link"
              value={record.music_link || ''}
              onChange={onChange}
              placeholder="例: https://open.spotify.com/album/..."
              className="full-width-input"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordEdit;
