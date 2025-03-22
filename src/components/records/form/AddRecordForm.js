import React, { useState } from 'react';
import RecordForm from './RecordForm';
import './styles/AddRecordForm.css';

const AddRecordForm = ({
  onAddRecord,
  onCancel,
  genres = [],
  countries = [],
  isDiscogsAvailable = false,
}) => {
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
    catalog_number: '',
  });

  const handleSubmit = (submittedData) => {
    onAddRecord(submittedData);
  };

  return (
    <div className="add-record-modal">
      <div className="detail-header">
        <div className="header-title">
          <h2>新しいレコードを追加</h2>
        </div>
        <div className="header-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            キャンセル
          </button>
          <button type="submit" className="save-button" form="record-form">
            追加
          </button>
        </div>
      </div>

      <div className="detail-content">
        <RecordForm
          mode="add"
          initialRecord={formData}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          genres={genres}
          countries={countries}
          isDiscogsAvailable={isDiscogsAvailable}
        />
      </div>
    </div>
  );
};

export default AddRecordForm;
