import React, { useRef } from 'react';
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

  // フォーム参照
  const formRef = useRef(null);

  // 保存ボタンのクリックハンドラー
  const handleSaveClick = () => {
    if (formRef.current && typeof formRef.current.submitForm === 'function') {
      formRef.current.submitForm();
    }
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
          <button type="button" className="save-button" onClick={handleSaveClick}>
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
          ref={formRef}
        />
      </div>
    </div>
  );
};

export default AddRecordForm;
