import React, { useState, useEffect } from 'react';
import './RecordList.css';
import RecordTable from './RecordTable';
import RecordCards from './RecordCards';
import { Pagination, SortControls } from './utils/RecordUtils';

/**
 * レコード一覧表示のメインコンポーネント
 * テーブル表示とカード表示を切り替える機能を持つ
 */
const RecordList = ({ records, onRecordSelect, onRecordDelete, onSort, sortConfig }) => {
  // localStorage から表示モードを取得するか、デフォルトに設定
  const getInitialViewMode = () => {
    const savedMode = localStorage.getItem('recordViewMode');
    return savedMode || 'table'; // デフォルトはテーブル表示
  };

  // ステート管理
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // 画面サイズの変更を監視
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);

      // モバイルの場合、自動的にカードビューに切り替え
      if (mobile && viewMode === 'table') {
        setViewMode('card');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初期ロード時にも実行

    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // レコード表示件数を変更
  const handleRecordsPerPageChange = (e) => {
    const newRecordsPerPage = parseInt(e.target.value, 10);
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1); // 表示件数変更時はページを1に戻す

    // ユーザー設定を保存
    try {
      localStorage.setItem('recordsPerPage', newRecordsPerPage.toString());
    } catch (e) {
      console.warn('Failed to save records per page setting to localStorage', e);
    }
  };

  // ページを変更
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // ページ変更時に先頭にスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // レコードのページネーション
  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    setDisplayedRecords(records.slice(indexOfFirstRecord, indexOfLastRecord));
    setTotalPages(Math.ceil(records.length / recordsPerPage));
  }, [records, currentPage, recordsPerPage]);

  // 初回ロード時に保存された設定を読み込む
  useEffect(() => {
    try {
      const savedRecordsPerPage = localStorage.getItem('recordsPerPage');
      if (savedRecordsPerPage) {
        setRecordsPerPage(parseInt(savedRecordsPerPage, 10));
      }
    } catch (e) {
      console.warn('Failed to load records per page setting from localStorage', e);
    }
  }, []);

  // ビューモードの切り替え
  const toggleViewMode = (mode) => {
    setViewMode(mode);

    // ユーザー設定を保存
    try {
      localStorage.setItem('recordViewMode', mode);
    } catch (e) {
      console.warn('Failed to save view mode setting to localStorage', e);
    }
  };

  // ソート方向変更のハンドラーをカプセル化
  const handleSort = (key, direction) => {
    onSort(key, direction || (sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="record-list modern">
      <div className="record-list-header">
        <div className="record-count">
          {records.length} 件のレコードが見つかりました
        </div>

        <div className="record-list-controls">
          {/* モバイルでは表示モード切り替えを非表示にすることも可能 */}
          <div className="view-mode-toggle">
            <button
              className={`view-mode-button ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => toggleViewMode('table')}
              title="テーブル表示"
              aria-label="テーブル表示に切り替え"
              aria-pressed={viewMode === 'table'}
              disabled={isMobileView} // モバイルではテーブル表示を無効化
            >
              <span className="view-icon" aria-hidden="true">☰</span>
            </button>
            <button
              className={`view-mode-button ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => toggleViewMode('card')}
              title="カード表示"
              aria-label="カード表示に切り替え"
              aria-pressed={viewMode === 'card'}
            >
              <span className="view-icon" aria-hidden="true">▦</span>
            </button>
          </div>

          {/* 並び順コントロール - 表示モードに関わらず常に表示 */}
          <SortControls 
            sortConfig={sortConfig} 
            onSort={handleSort}
            viewMode={viewMode}
          />

          <div className="records-per-page">
            <label htmlFor="records-per-page" className="records-per-page-label">表示件数:</label>
            <select
              id="records-per-page"
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              aria-label="ページあたりの表示件数"
            >
              <option value="10">10件</option>
              <option value="20">20件</option>
              <option value="50">50件</option>
              <option value="100">100件</option>
            </select>
          </div>
        </div>
      </div>

      <div className="record-list-content">
        {/* 表示モードに応じてコンポーネントを切り替え */}
        {isMobileView || viewMode === 'card' ? (
          <RecordCards 
            records={displayedRecords} 
            onRecordSelect={onRecordSelect}
            onRecordDelete={onRecordDelete}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        ) : (
          <RecordTable 
            records={displayedRecords} 
            onRecordSelect={onRecordSelect}
            onRecordDelete={onRecordDelete}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        )}
      </div>

      {/* ページネーション */}
      {records.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          recordsCount={records.length}
          recordsPerPage={recordsPerPage}
        />
      )}
    </div>
  );
};

export default RecordList;