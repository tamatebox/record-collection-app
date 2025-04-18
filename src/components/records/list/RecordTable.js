import React, { useState } from 'react';
import { formatDate, getSortIcon, NoRecordsMessage } from './utils/RecordUtils';
import DefaultRecordImage from '../../../assets/default-record.svg';

/**
 * レコードのテーブル表示コンポーネント
 */
const RecordTable = ({ records, onRecordSelect, onRecordDelete, onSort, sortConfig }) => {
  // 画像エラー状態を管理するステート
  const [imageErrors, setImageErrors] = useState({});

  // 画像読み込みエラーを処理するハンドラー
  const handleImageError = (recordId) => {
    setImageErrors((prev) => ({
      ...prev,
      [recordId]: true,
    }));
  };

  if (records.length === 0) {
    return <NoRecordsMessage />;
  }

  return (
    <div className="table-responsive">
      <table className="record-table" role="grid">
        <thead>
          <tr>
            <th role="columnheader" className="image-column">
              画像
            </th>
            <th
              onClick={() => onSort('artist')}
              role="columnheader"
              aria-sort={sortConfig.key === 'artist' ? sortConfig.direction : 'none'}
            >
              アーティスト {getSortIcon('artist', sortConfig)}
            </th>
            <th
              onClick={() => onSort('album_name')}
              role="columnheader"
              aria-sort={sortConfig.key === 'album_name' ? sortConfig.direction : 'none'}
            >
              アルバム名 {getSortIcon('album_name', sortConfig)}
            </th>
            <th
              onClick={() => onSort('release_year')}
              role="columnheader"
              aria-sort={sortConfig.key === 'release_year' ? sortConfig.direction : 'none'}
            >
              発売年 {getSortIcon('release_year', sortConfig)}
            </th>
            <th
              onClick={() => onSort('genre')}
              role="columnheader"
              aria-sort={sortConfig.key === 'genre' ? sortConfig.direction : 'none'}
            >
              ジャンル {getSortIcon('genre', sortConfig)}
            </th>
            <th
              onClick={() => onSort('size')}
              role="columnheader"
              aria-sort={sortConfig.key === 'size' ? sortConfig.direction : 'none'}
            >
              サイズ {getSortIcon('size', sortConfig)}
            </th>
            <th
              onClick={() => onSort('acquisition_date')}
              role="columnheader"
              aria-sort={sortConfig.key === 'acquisition_date' ? sortConfig.direction : 'none'}
            >
              追加日 {getSortIcon('acquisition_date', sortConfig)}
            </th>
            <th role="columnheader">{/* アクションカラム - テキストなし */}</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            // 画像パスを取得 - DBからの値を使用
            const imagePath = record.full_image || null;
            const hasImageError = imageErrors[record.id];

            return (
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
                <td role="cell" className="record-thumbnail-cell">
                  <div className="record-thumbnail-container">
                    <img
                      src={hasImageError || !imagePath ? DefaultRecordImage : imagePath}
                      alt={`${record.album_name}のジャケット`}
                      className="record-thumbnail"
                      onError={() => handleImageError(record.id)}
                    />
                  </div>
                </td>
                <td role="cell" title={record.artist}>
                  {record.artist}
                </td>
                <td role="cell" title={record.album_name}>
                  {record.album_name}
                </td>
                <td role="cell" title={record.release_year}>
                  {record.release_year}
                </td>
                <td role="cell" title={record.genre}>
                  {record.genre}
                </td>
                <td role="cell" title={`${record.size}インチ`}>
                  {record.size ? `${record.size}"` : ''}
                </td>
                <td role="cell" title={formatDate(record.acquisition_date)}>
                  {formatDate(record.acquisition_date)}
                </td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecordTable;
