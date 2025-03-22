import React, { useState } from 'react';
import RecordDetailView from './RecordDetailView';
import RecordForm from '../form/RecordForm';
import './styles/RecordDetail.css';

const RecordDetail = ({
  record,
  onClose,
  onUpdate,
  genres = [],
  countries = [],
  isDiscogsAvailable,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // 編集モードの切り替え
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // レコードの保存
  const handleSave = async (editedRecord) => {
    try {
      await onUpdate(record.id, editedRecord);
      setIsEditing(false);
    } catch (err) {
      alert('レコードの更新中にエラーが発生しました: ' + err.message);
    }
  };

  return (
    <div className="record-detail-modal">
      <div className="detail-header">
        <div className="header-title">
          <h2>{isEditing ? '編集' : '詳細'}</h2>
          <span className="header-subtitle">
            {record.artist} - {record.album_name}
          </span>
        </div>
        <div className="header-actions">
          {isEditing ? (
            <>
              <button className="cancel-button" onClick={toggleEditMode}>
                キャンセル
              </button>
              <button
                className="save-button"
                onClick={() => {
                  // FormのSubmitイベントを発火
                  document.getElementById('record-form').dispatchEvent(new Event('submit'));
                }}
              >
                保存
              </button>
            </>
          ) : (
            <button className="edit-button" onClick={toggleEditMode}>
              編集
            </button>
          )}
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="detail-content">
        {isEditing ? (
          <RecordForm
            mode="edit"
            initialRecord={record}
            onSubmit={handleSave}
            onCancel={toggleEditMode}
            genres={genres}
            countries={countries}
            // 編集モードでもDiscogs検索を表示
            isDiscogsAvailable={isDiscogsAvailable}
          />
        ) : (
          <RecordDetailView record={record} />
        )}
      </div>
    </div>
  );
};

export default RecordDetail;
