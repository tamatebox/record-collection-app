import { useState, useEffect } from 'react';
import RecordDetailView from './RecordDetailView';
import RecordForm from '../form/RecordForm';
import '../../../styles/components/records/recordDetail.css';

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

  // ヘッダースタイル - モバイルとデスクトップで異なるスタイルを適用
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: '#fbfbfb',
  };

  // タイトルスタイル
  const titleStyle = {
    margin: 0,
    fontSize: isMobile ? '1.3rem' : '1.5rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    flex: 1,
    textAlign: isMobile ? 'left' : 'left',
  };

  // ボタングループスタイル
  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
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
                <button
                  className="save-button"
                  onClick={() => {
                    document.getElementById('record-form')?.dispatchEvent(new Event('submit'));
                  }}
                >
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
        <div style={headerStyle}>
          <h2 style={titleStyle}>{isEditing ? 'レコード編集' : 'レコード詳細'}</h2>
          <div style={actionsStyle}>
            {isEditing ? (
              <>
                <button className="cancel-button" onClick={toggleEditMode}>
                  キャンセル
                </button>
                <button
                  className="save-button"
                  onClick={() => {
                    document.getElementById('record-form')?.dispatchEvent(new Event('submit'));
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
          />
        ) : (
          <RecordDetailView record={record} />
        )}
      </div>
    </div>
  );
};

export default RecordDetail;
