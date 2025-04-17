import { useState, useEffect, useRef } from 'react';
import RecordDetailView from './RecordDetailView';
import RecordForm from '../form/RecordForm';
import '../../../styles/components/records/record-common.css';

/**
 * レコード詳細表示のメインコンポーネント
 * 詳細表示と編集モードの切り替えを管理
 */
const RecordDetail = ({
  record,
  onClose,
  onUpdate,
  genres = [],
  countries = [],
  isDiscogsAvailable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初期チェック
    checkMobile();

    // リサイズイベント時に再計算
    window.addEventListener('resize', checkMobile);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

  // フォーム参照を保持する
  const formRef = useRef(null);

  // 保存ボタンのクリックハンドラ
  const handleSaveClick = () => {
    // formRefが設定されていれば、その中のsubmit関数を呼び出す
    if (formRef.current && typeof formRef.current.submitForm === 'function') {
      formRef.current.submitForm();
    }
  };

  return (
    <div className="record-detail-modal">
      {isMobile ? (
        <div className="mobile-detail-header">
          <h2>{isEditing ? 'レコード編集' : 'レコード詳細'}</h2>
          <div className="mobile-header-actions">
            {isEditing ? (
              <>
                <button className="cancel-button" onClick={toggleEditMode}>
                  キャンセル
                </button>
                <button className="save-button" onClick={handleSaveClick}>
                  保存
                </button>
              </>
            ) : (
              <button className="edit-button" onClick={toggleEditMode} aria-label="レコード編集">
                編集
              </button>
            )}
            <button className="close-button" onClick={onClose} aria-label="閉じる">
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="detail-header">
          <h2>{isEditing ? 'レコード編集' : 'レコード詳細'}</h2>
          <div className="header-actions">
            {isEditing ? (
              <>
                <button className="cancel-button" onClick={toggleEditMode}>
                  キャンセル
                </button>
                <button className="save-button" onClick={handleSaveClick}>
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
      )}

      <div className="detail-content">
        {isEditing ? (
          <RecordForm
            mode="edit"
            initialRecord={record}
            onSubmit={handleSave}
            onCancel={toggleEditMode}
            genres={genres}
            countries={countries}
            isDiscogsAvailable={isDiscogsAvailable}
            ref={formRef}
          />
        ) : (
          <RecordDetailView record={record} />
        )}
      </div>
    </div>
  );
};

export default RecordDetail;
