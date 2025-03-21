import React, { useState, useEffect, useRef } from 'react';
import './RecordFilter.css';

// フィルターモーダルコンポーネント
const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onApply,
  genres = [],
  countries = [],
  decades = [],
  sizes = [],
}) => {
  // モーダル内でのフィルター状態を管理
  const [modalFilters, setModalFilters] = useState({ ...filters });

  // 親コンポーネントのフィルターが変更されたらモーダル内も更新
  useEffect(() => {
    setModalFilters({ ...filters });
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setModalFilters({
      ...modalFilters,
      [filterName]: value,
    });
  };

  // フィルターを適用して閉じる
  const applyFilters = () => {
    onApply(modalFilters);
    onClose();
  };

  // モーダル外をクリックした場合のハンドラー
  const handleOutsideClick = (e) => {
    if (e.target.className === 'filter-modal-overlay') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal-overlay" onClick={handleOutsideClick}>
      <div className="filter-modal-content">
        <div className="filter-modal-header">
          <h2>フィルター設定</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="filter-modal-body">
          <div className="filter-section">
            <h3>検索</h3>
            <input
              type="text"
              placeholder="アーティストやアルバム名で検索"
              value={modalFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="modal-search-input"
            />
          </div>

          <div className="filter-section">
            <h3>ジャンル</h3>
            <div className="checkbox-grid">
              {genres.map((genre) => (
                <label key={genre} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={(modalFilters.genres || []).includes(genre)}
                    onChange={() => {
                      const current = modalFilters.genres || [];
                      const newValue = current.includes(genre)
                        ? current.filter((g) => g !== genre)
                        : [...current, genre];
                      handleFilterChange('genres', newValue);
                    }}
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>年代</h3>
            <div className="checkbox-grid">
              {decades.map((decade) => (
                <label key={decade} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={(modalFilters.decades || []).includes(decade)}
                    onChange={() => {
                      const current = modalFilters.decades || [];
                      const newValue = current.includes(decade)
                        ? current.filter((d) => d !== decade)
                        : [...current, decade];
                      handleFilterChange('decades', newValue);
                    }}
                  />
                  <span>{decade}年代</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>国</h3>
            <div className="checkbox-grid">
              {countries.map((country) => (
                <label key={country} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={(modalFilters.countries || []).includes(country)}
                    onChange={() => {
                      const current = modalFilters.countries || [];
                      const newValue = current.includes(country)
                        ? current.filter((c) => c !== country)
                        : [...current, country];
                      handleFilterChange('countries', newValue);
                    }}
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>サイズ</h3>
            <div className="checkbox-grid">
              {sizes.map((size) => (
                <label key={size} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={(modalFilters.sizes || []).includes(size)}
                    onChange={() => {
                      const current = modalFilters.sizes || [];
                      const newValue = current.includes(size)
                        ? current.filter((s) => s !== size)
                        : [...current, size];
                      handleFilterChange('sizes', newValue);
                    }}
                  />
                  <span>{size}"</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-modal-footer">
          <button
            className="modal-reset-btn"
            onClick={() =>
              setModalFilters({
                search: '',
                genres: [],
                decades: [],
                countries: [],
                sizes: [],
              })
            }
          >
            リセット
          </button>
          <button className="modal-apply-btn" onClick={applyFilters}>
            適用
          </button>
        </div>
      </div>
    </div>
  );
};

// ドロップダウンコンポーネント - クリックでも開閉するバージョン
const FilterDropdown = ({ buttonText, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // 外部クリック時に閉じる処理
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // クリックイベントリスナーを追加
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // クリーンアップ
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button
        className="filter-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {buttonText}
      </button>
      <div className={`filter-dropdown-content ${isOpen ? 'show' : ''}`}>{children}</div>
    </div>
  );
};

// 既存のMultiSelectコンポーネント
const MultiSelect = ({ options, value, onChange, placeholder }) => {
  return (
    <div className="multi-select">
      <div className="multi-select-placeholder">
        {value.length === 0
          ? placeholder
          : value.length === 1
            ? value[0]
            : `${placeholder}（${value.length}）`}
      </div>
      <div className="multi-select-dropdown">
        <div className="multi-select-options">
          {options.map((option) => (
            <label key={option} className="multi-select-option">
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => {
                  const newValue = value.includes(option)
                    ? value.filter((v) => v !== option)
                    : [...value, option];
                  onChange(newValue);
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecordFilter = ({
  filters,
  onFilterChange,
  genres = [],
  countries = [],
  decades = [],
  sizes = [],
}) => {
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    genres: filters.genres || [],
    decades: filters.decades || [],
    countries: filters.countries || [],
    sizes: filters.sizes || [],
  });

  // フィルターモーダルの表示状態
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 画面サイズを監視
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...localFilters,
      [filterName]: value,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const removeFilter = (filterName, value) => {
    const newFilters = {
      ...localFilters,
      [filterName]: localFilters[filterName].filter((item) => item !== value),
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      genres: [],
      decades: [],
      countries: [],
      sizes: [],
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilters = [
    ...localFilters.genres.map((genre) => ({ type: 'ジャンル', value: genre })),
    ...localFilters.decades.map((decade) => ({ type: '年代', value: `${decade}年代` })),
    ...localFilters.countries.map((country) => ({ type: '国', value: country })),
    ...localFilters.sizes.map((size) => ({ type: 'サイズ', value: `${size}"` })),
  ];

  // フィルターモーダルからのフィルター適用処理
  const handleApplyModalFilters = (modalFilters) => {
    setLocalFilters(modalFilters);
    onFilterChange(modalFilters);
  };

  // フィルターの数を数える（検索も含む）
  const activeFiltersCount = activeFilters.length + (localFilters.search ? 1 : 0);

  return (
    <div className="record-filter-container">
      {/* モバイル表示用のシンプルな検索バーとフィルターボタン */}
      {isMobile ? (
        <div className="mobile-filter-bar">
          <div className="mobile-search-wrapper">
            <input
              type="text"
              placeholder="レコードを検索"
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="mobile-search-input"
            />
            {localFilters.search && (
              <button
                className="mobile-clear-search"
                onClick={() => handleFilterChange('search', '')}
              >
                ✕
              </button>
            )}
          </div>

          <button
            className={`mobile-filter-btn ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
            onClick={() => setIsModalOpen(true)}
          >
            フィルター
            {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
          </button>
        </div>
      ) : (
        /* デスクトップ表示用の標準フィルターバー */
        <div className="desktop-filter-bar">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="レコードを検索"
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            {localFilters.search && (
              <button className="clear-search-btn" onClick={() => handleFilterChange('search', '')}>
                ✕
              </button>
            )}
          </div>

          <div className="filter-buttons">
            {/* 新しいFilterDropdownコンポーネントを使用 */}
            <FilterDropdown
              buttonText={
                <>
                  ジャンル
                  {localFilters.genres.length > 0 && (
                    <span className="filter-badge">{localFilters.genres.length}</span>
                  )}
                </>
              }
            >
              {genres.map((genre) => (
                <label key={genre} className="filter-option">
                  <input
                    type="checkbox"
                    checked={localFilters.genres.includes(genre)}
                    onChange={() => {
                      const newGenres = localFilters.genres.includes(genre)
                        ? localFilters.genres.filter((g) => g !== genre)
                        : [...localFilters.genres, genre];
                      handleFilterChange('genres', newGenres);
                    }}
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </FilterDropdown>

            <FilterDropdown
              buttonText={
                <>
                  年代
                  {localFilters.decades.length > 0 && (
                    <span className="filter-badge">{localFilters.decades.length}</span>
                  )}
                </>
              }
            >
              {decades.map((decade) => (
                <label key={decade} className="filter-option">
                  <input
                    type="checkbox"
                    checked={localFilters.decades.includes(decade)}
                    onChange={() => {
                      const newDecades = localFilters.decades.includes(decade)
                        ? localFilters.decades.filter((d) => d !== decade)
                        : [...localFilters.decades, decade];
                      handleFilterChange('decades', newDecades);
                    }}
                  />
                  <span>{decade}年代</span>
                </label>
              ))}
            </FilterDropdown>

            <FilterDropdown
              buttonText={
                <>
                  その他のフィルター
                  {(localFilters.countries.length > 0 || localFilters.sizes.length > 0) && (
                    <span className="filter-badge">
                      {localFilters.countries.length + localFilters.sizes.length}
                    </span>
                  )}
                </>
              }
            >
              <div className="filter-dropdown-section">
                <h4>国</h4>
                <div className="filter-option-grid">
                  {countries.map((country) => (
                    <label key={country} className="filter-option">
                      <input
                        type="checkbox"
                        checked={localFilters.countries.includes(country)}
                        onChange={() => {
                          const newCountries = localFilters.countries.includes(country)
                            ? localFilters.countries.filter((c) => c !== country)
                            : [...localFilters.countries, country];
                          handleFilterChange('countries', newCountries);
                        }}
                      />
                      <span>{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-dropdown-section">
                <h4>サイズ</h4>
                <div className="filter-option-grid">
                  {sizes.map((size) => (
                    <label key={size} className="filter-option">
                      <input
                        type="checkbox"
                        checked={localFilters.sizes.includes(size)}
                        onChange={() => {
                          const newSizes = localFilters.sizes.includes(size)
                            ? localFilters.sizes.filter((s) => s !== size)
                            : [...localFilters.sizes, size];
                          handleFilterChange('sizes', newSizes);
                        }}
                      />
                      <span>{size}"</span>
                    </label>
                  ))}
                </div>
              </div>
            </FilterDropdown>

            {/* すべてクリアボタンはここから除去 */}
          </div>
        </div>
      )}

      {/* アクティブフィルターのタグ表示 - モバイルとデスクトップ両方で表示 */}
      {activeFilters.length > 0 && (
        <div className="active-filters-container">
          <div className="active-filters-header">
            <span className="active-filters-title">適用中のフィルター</span>
            <button className="clear-all-btn" onClick={clearAllFilters}>
              すべてクリア
            </button>
          </div>
          <div className="active-filters">
            {activeFilters.map((filter, index) => (
              <div key={index} className="active-filter-tag">
                <span className="filter-type">{filter.type}:</span>
                <span className="filter-value">{filter.value}</span>
                <button
                  className="remove-filter-btn"
                  onClick={() => {
                    // 年代フィルターを削除する場合の処理を修正
                    let filterValue = filter.value;
                    if (filter.type === '年代') {
                      filterValue = parseInt(filter.value.replace('年代', ''), 10);
                    } else if (filter.type === 'サイズ') {
                      filterValue = filter.value.replace('"', '');
                    }

                    removeFilter(
                      filter.type === 'ジャンル'
                        ? 'genres'
                        : filter.type === '年代'
                          ? 'decades'
                          : filter.type === '国'
                            ? 'countries'
                            : 'sizes',
                      filterValue
                    );
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フィルターモーダル - モバイル表示時に使用 */}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={localFilters}
        onApply={handleApplyModalFilters}
        genres={genres}
        countries={countries}
        decades={decades}
        sizes={sizes}
      />
    </div>
  );
};

export default RecordFilter;
