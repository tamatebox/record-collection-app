import React, { useState, useEffect } from 'react';
import RecordDetailView from './RecordDetailView';
import RecordEdit from './RecordEdit';
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
  
  // 星評価の変更を処理するハンドラー
  const handleStarChange = (rating) => {
    setEditedRecord({
      ...editedRecord,
      star: rating.toString()
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
        {isEditing ? (
          <RecordEdit 
            record={editedRecord} 
            onChange={handleChange} 
            onStarChange={handleStarChange}
            genres={genres}
            countries={countries}
          />
        ) : (
          <RecordDetailView record={record} />
        )}
      </div>
    </div>
  );
};

export default RecordDetail;