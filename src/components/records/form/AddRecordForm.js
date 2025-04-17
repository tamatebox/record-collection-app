import React from 'react';
import RecordForm from './RecordForm';
import '../../../styles/components/records/record-common.css';
import './styles/AddRecordForm.css';

const AddRecordForm = ({
  onAddRecord,
  onCancel,
  genres = [],
  countries = [],
  isDiscogsAvailable = false,
}) => {
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
