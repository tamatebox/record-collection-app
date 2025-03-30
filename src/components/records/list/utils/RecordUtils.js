import React from 'react';

/**
 * 共通ユーティリティ関数
 */

// 日付のフォーマット
export const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  } catch (e) {
    return dateString;
  }
};

// 評価の星を表示 (アクセシビリティ対応) - 残しておきますが使用箇所を削除しています
export const renderStars = (rating) => {
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

// ソートアイコンを取得
export const getSortIcon = (key, sortConfig) => {
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

// 共通ソートコントロールコンポーネント
export const SortControls = ({ sortConfig, onSort, viewMode }) => (
  <div className="sort-controls">
    <label htmlFor="sort-select">並び順:</label>
    <select
      id="sort-select"
      value={`${sortConfig.key}-${sortConfig.direction}`}
      onChange={(e) => {
        const [key, direction] = e.target.value.split('-');
        onSort(key, direction);
      }}
      aria-label="レコードの並び順を選択"
    >
      <option value="artist-asc">アーティスト名 (A→Z)</option>
      <option value="artist-desc">アーティスト名 (Z→A)</option>
      <option value="album_name-asc">アルバム名 (A→Z)</option>
      <option value="album_name-desc">アルバム名 (Z→A)</option>
      <option value="release_year-asc">発売年 (古い順)</option>
      <option value="release_year-desc">発売年 (新しい順)</option>
      <option value="acquisition_date-asc">追加日 (古い順)</option>
      <option value="acquisition_date-desc">追加日 (新しい順)</option>
    </select>
  </div>
);

// ページネーションコンポーネント
export const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  recordsCount,
  recordsPerPage,
}) => {
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
        <span key="start-ellipsis" className="page-ellipsis" aria-hidden="true">
          ...
        </span>
      );
    } else {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`page-button ${currentPage === 1 ? 'active' : ''}`}
          aria-label="1ページ目"
          aria-current={currentPage === 1 ? 'page' : null}
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
        aria-current={currentPage === i ? 'page' : null}
      >
        {i}
      </button>
    );
  }

  // 最後のページへの省略記号
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <span key="end-ellipsis" className="page-ellipsis" aria-hidden="true">
          ...
        </span>
      );
    } else {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`page-button ${currentPage === totalPages ? 'active' : ''}`}
          aria-label={`${totalPages}ページ目（最後）`}
          aria-current={currentPage === totalPages ? 'page' : null}
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
        {recordsCount > 0 ? (
          <span>
            {(currentPage - 1) * recordsPerPage + 1} -{' '}
            {Math.min(currentPage * recordsPerPage, recordsCount)} / {recordsCount}件
          </span>
        ) : (
          <span>0件</span>
        )}
      </div>
    </div>
  );
};

// レコードが存在しない場合のメッセージ
export const NoRecordsMessage = () => (
  <div className="no-records">条件に一致するレコードがありません</div>
);
