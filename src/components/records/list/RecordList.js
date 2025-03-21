import React, { useState, useEffect } from 'react';
import './RecordList.css';

const RecordList = ({ records, onRecordSelect, onRecordDelete, onSort, sortConfig }) => {
  // localStorage から表示モードを取得するか、デフォルトに設定
  const getInitialViewMode = () => {
    const savedMode = localStorage.getItem('recordViewMode');
    return savedMode || 'table'; // デフォルトはテーブル表示
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20); // デフォルトで20件表示
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState(getInitialViewMode); // localStorage から初期値を取得
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

  // ソートアイコンを取得
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return (
        <span className={`sort-icon ${sortConfig.direction}`} aria-hidden="true">
          {sortConfig.direction === 'asc' ? '↑' : '↓'}
        </span>
      );
    }
    // ソートされていない場合は、スペースを確保するためのプレースホルダーを返す
    return <span className="sort-icon placeholder"></span>;
  };

  // 日付のフォーマット
  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP');
    } catch (e) {
      return dateString;
    }
  };

  // 評価の星を表示 (アクセシビリティ対応)
  const renderStars = (rating) => {
    const stars = [];
    const numRating = rating ? parseInt(rating, 10) : 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < numRating ? 'star filled' : 'star'}
          role="img"
          aria-label={i < numRating ? '評価された星' : '評価されていない星'}
        >
          ★
        </span>
      );
    }

    return (
      <div className="record-rating" aria-label={`5段階中${numRating}の評価`}>
        {stars}
      </div>
    );
  };

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

  // ページネーションコントロールの生成
  const renderPagination = () => {
    // ページが1つだけの場合はページネーションを表示しない
    if (totalPages <= 1) return null;

    const pageNumbers = [];

    // 最初のページへのリンク
    pageNumbers.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
        aria-label="最初のページへ"
      >
        &laquo;
      </button>
    );

    // 前のページへのリンク
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
        aria-label="前のページへ"
      >
        &lt;
      </button>
    );

    // ページ番号
    // 現在のページの前後に表示するページ数
    const pageBuffer = 2;
    const startPage = Math.max(1, currentPage - pageBuffer);
    const endPage = Math.min(totalPages, currentPage + pageBuffer);

    // 最初のページへの省略記号
    if (startPage > 1) {
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="page-ellipsis" aria-hidden="true">...</span>
        );
      } else {
        pageNumbers.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className={`page-button ${currentPage === 1 ? 'active' : ''}`}
            aria-label="1ページ目"
            aria-current={currentPage === 1 ? "page" : null}
          >
            1
          </button>
        );
      }
    }

    // ページ番号
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-button ${currentPage === i ? 'active' : ''}`}
          aria-label={`${i}ページ目`}
          aria-current={currentPage === i ? "page" : null}
        >
          {i}
        </button>
      );
    }

    // 最後のページへの省略記号
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="page-ellipsis" aria-hidden="true">...</span>
        );
      } else {
        pageNumbers.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`page-button ${currentPage === totalPages ? 'active' : ''}`}
            aria-label={`${totalPages}ページ目（最後）`}
            aria-current={currentPage === totalPages ? "page" : null}
          >
            {totalPages}
          </button>
        );
      }
    }

    // 次のページへのリンク
    pageNumbers.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`page-button ${currentPage === totalPages ? 'disabled' : ''}`}
        aria-label="次のページへ"
      >
        &gt;
      </button>
    );

    // 最後のページへのリンク
    pageNumbers.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`page-button ${currentPage === totalPages ? 'disabled' : ''}`}
        aria-label="最後のページへ"
      >
        &raquo;
      </button>
    );

    return (
      <div className="pagination-container">
        <div className="pagination-controls" role="navigation" aria-label="ページネーション">
          {pageNumbers}
        </div>
        <div className="page-info">
          {records.length > 0 ? (
            <span>{(currentPage - 1) * recordsPerPage + 1} - {Math.min(currentPage * recordsPerPage, records.length)} / {records.length}件</span>
          ) : (
            <span>0件</span>
          )}
        </div>
      </div>
    );
  };

  // RecordList.jsのカード表示用のソートコントロール
  const renderSortControls = () => {
    // カード表示の時だけ表示
    if (viewMode !== 'card') return null;

    return (
      <div className="card-sort-controls">
        <label htmlFor="card-sort-select">並び順:</label>
        <select
          id="card-sort-select"
          value={`${sortConfig.key}-${sortConfig.direction}`}
          onChange={(e) => {
            const [key, direction] = e.target.value.split('-');
            onSort(key, direction); // 親コンポーネントのソート関数を呼び出す
          }}
          aria-label="カードの並び順を選択"
        >
          <option value="artist-asc">アーティスト名 (A→Z)</option>
          <option value="artist-desc">アーティスト名 (Z→A)</option>
          <option value="album_name-asc">アルバム名 (A→Z)</option>
          <option value="album_name-desc">アルバム名 (Z→A)</option>
          <option value="release_year-asc">発売年 (古い順)</option>
          <option value="release_year-desc">発売年 (新しい順)</option>
          <option value="acquisition_date-asc">追加日 (古い順)</option>
          <option value="acquisition_date-desc">追加日 (新しい順)</option>
          <option value="star-desc">評価 (高い順)</option>
          <option value="star-asc">評価 (低い順)</option>
        </select>
      </div>
    );
  };

  // カード表示のレンダリング
  const renderCardView = () => {
    if (displayedRecords.length === 0) {
      return (
        <div className="no-records">
          条件に一致するレコードがありません
        </div>
      );
    }

    return (
      <div className="record-cards">
        {displayedRecords.map(record => (
          <div
            key={record.id}
            className="record-card"
            onClick={() => onRecordSelect(record)}
            role="button"
            tabIndex="0"
            aria-label={`${record.artist}の${record.album_name}を選択`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onRecordSelect(record);
              }
            }}
          >
            <div className="record-card-header">
              <h3 className="record-artist">{record.artist}</h3>
              {renderStars(record.star)}
            </div>

            <div className="record-card-content">
              <h4 className="record-album">{record.album_name}</h4>

              <div className="record-info">
                <div className="record-detail">
                  <span className="record-year">{record.release_year || '不明'}</span>
                  <span className="record-separator" aria-hidden="true">·</span>
                  <span className="record-genre">{record.genre || '不明'}</span>
                </div>

                <div className="record-detail">
                  <span className="record-country">{record.country || '不明'}</span>
                  <span className="record-separator" aria-hidden="true">·</span>
                  <span className="record-size">{record.size}"</span>
                </div>

                <div className="record-date">
                  追加日: {formatDate(record.acquisition_date)}
                </div>
              </div>
            </div>

            <div className="record-card-actions">
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('このレコードを削除してもよろしいですか？')) {
                    onRecordDelete(record.id);
                  }
                }}
                aria-label={`${record.artist}の${record.album_name}を削除`}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // テーブル表示のレンダリング
  const renderTableView = () => {
    if (displayedRecords.length === 0) {
      return (
        <div className="no-records">
          条件に一致するレコードがありません
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="record-table" role="grid">
          <thead>
            <tr>
              <th onClick={() => onSort('artist')} role="columnheader" aria-sort={sortConfig.key === 'artist' ? sortConfig.direction : 'none'}>
                アーティスト {getSortIcon('artist')}
              </th>
              <th onClick={() => onSort('album_name')} role="columnheader" aria-sort={sortConfig.key === 'album_name' ? sortConfig.direction : 'none'}>
                アルバム名 {getSortIcon('album_name')}
              </th>
              <th onClick={() => onSort('release_year')} role="columnheader" aria-sort={sortConfig.key === 'release_year' ? sortConfig.direction : 'none'}>
                発売年 {getSortIcon('release_year')}
              </th>
              <th onClick={() => onSort('genre')} role="columnheader" aria-sort={sortConfig.key === 'genre' ? sortConfig.direction : 'none'}>
                ジャンル {getSortIcon('genre')}
              </th>
              <th onClick={() => onSort('size')} role="columnheader" aria-sort={sortConfig.key === 'size' ? sortConfig.direction : 'none'}>
                サイズ {getSortIcon('size')}
              </th>
              <th onClick={() => onSort('acquisition_date')} role="columnheader" aria-sort={sortConfig.key === 'acquisition_date' ? sortConfig.direction : 'none'}>
                追加日 {getSortIcon('acquisition_date')}
              </th>
              <th onClick={() => onSort('star')} role="columnheader" aria-sort={sortConfig.key === 'star' ? sortConfig.direction : 'none'}>
                評価 {getSortIcon('star')}
              </th>
              <th role="columnheader">アクション</th>
            </tr>
          </thead>
          <tbody>
            {displayedRecords.map(record => (
              <tr
                key={record.id}
                onClick={() => onRecordSelect(record)}
                tabIndex="0"
                role="row"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onRecordSelect(record);
                  }
                }}
              >
                <td role="cell" title={record.artist}>{record.artist}</td>
                <td role="cell" title={record.album_name}>{record.album_name}</td>
                <td role="cell" title={record.release_year}>{record.release_year}</td>
                <td role="cell" title={record.genre}>{record.genre}</td>
                <td role="cell" title={`${record.size}インチ`}>{record.size ? `${record.size}"` : ''}</td>
                <td role="cell" title={formatDate(record.acquisition_date)}>{formatDate(record.acquisition_date)}</td>
                <td role="cell">{renderStars(record.star)}</td>
                <td role="cell" className="action-buttons">
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('このレコードを削除してもよろしいですか？')) {
                        onRecordDelete(record.id);
                      }
                    }}
                    aria-label={`${record.artist}の${record.album_name}を削除`}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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

          {renderSortControls()} {/* ここにソートコントロールを追加 */}

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
        {/* モバイルでは強制的にカードビュー、それ以外は選択されたビューモード */}
        {isMobileView || viewMode === 'card' ? renderCardView() : renderTableView()}
      </div>

      {records.length > 0 && renderPagination()}
    </div>
  );
};

export default RecordList;