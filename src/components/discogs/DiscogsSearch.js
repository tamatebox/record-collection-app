import React, { useState } from 'react';
import { discogsSearch } from '../../utils/discogsAuth';
import { useDiscogsAuth } from '../../contexts/DiscogsAuthContext';
import { mapDiscogsSearchResultToRecord } from '../../utils/discogsMapper';
import './DiscogsSearch.css';

const DiscogsSearch = ({ onSelectRecord, onCancel }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useDiscogsAuth();

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('検索キーワードを入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 検索リクエスト
      const response = await discogsSearch(query);
      setSearchResults(response.results || []);

      if (response.results && response.results.length === 0) {
        setError('検索結果が見つかりませんでした');
      }
    } catch (error) {
      console.error('Discogs検索エラー:', error);

      // エラーメッセージを設定
      if (error.response && error.response.status === 401) {
        setError('Discogsとの連携が切れています。再度連携してください。');
      } else {
        setError(`検索中にエラーが発生しました: ${error.message || '不明なエラー'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Enterキーで検索実行
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectRecord = (record) => {
    // 親コンポーネントに選択されたレコードを渡す
    if (onSelectRecord) {
      // Discogsマッパーを使用してレコードデータを変換
      const selectedRecord = mapDiscogsSearchResultToRecord(record);
      onSelectRecord(selectedRecord);
    }
  };

  return (
    <div className="discogs-search-container">
      <div className="search-header">
        <h3>Discogsでレコードを検索</h3>
        {onCancel && (
          <button
            className="close-button"
            onClick={onCancel}
            aria-label="閉じる"
          >
            ×
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="discogs-auth-needed">
          <p>Discogsからレコード情報を取得するには、先に連携が必要です。</p>
          <p>画面上部の「Discogsと連携」ボタンをクリックしてください。</p>
        </div>
      ) : (
        <div className="search-section">
          <div className="search-input-container">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="アーティスト名やアルバム名を入力"
              className="search-input"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              className={`search-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? '検索中...' : '検索'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="search-results">
            {searchResults.length > 0 ? (
              <div className="discogs-results-list">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="discogs-result-item"
                    onClick={() => handleSelectRecord(result)}
                  >
                    <div className="discogs-result-thumbnail">
                      {result.coverImage || result.thumb ? (
                        <img
                          src={result.coverImage || result.thumb}
                          alt={result.title}
                          className="discogs-result-image"
                        />
                      ) : (
                        <div className="discogs-result-no-image">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="discogs-result-info">
                      <div className="discogs-result-title">{result.title}</div>
                      <div className="discogs-result-details">
                        {result.year && (
                          <span className="discogs-result-year">{result.year}</span>
                        )}
                        {result.country && (
                          <span className="discogs-result-country">{result.country}</span>
                        )}
                        {result.genre && (
                          <span className="discogs-result-country">{result.genre}</span>
                        )}
                        {result.catno && (
                          <span className="discogs-result-country">{result.catno}</span>
                        )}
                        {result.format && (
                          <span className="discogs-result-format">
                            {Array.isArray(result.format) ? result.format.join(', ') : result.format}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading && !error && query && (
              <div className="no-results">
                検索結果がありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscogsSearch;
