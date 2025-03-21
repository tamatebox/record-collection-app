import { useState, useEffect, useMemo } from 'react';
import { getRecords, addRecord, deleteRecord, updateRecord } from '../utils/api';

// テキスト検索関数
const searchTextMatch = (record, searchText) => {
  const searchFields = ['artist', 'album_name', 'alphabet_artist', 'label', 'catalog_number'];

  return searchFields.some((field) =>
    record[field]?.toLowerCase().includes(searchText.toLowerCase())
  );
};

// ジャンルフィルター関数
const genreFilter = (record, genres) => genres.length === 0 || genres.includes(record.genre);

// 年代フィルター関数
const decadeFilter = (record, decades) =>
  decades.length === 0 ||
  decades.some(
    (decade) =>
      parseInt(record.release_year, 10) >= decade && parseInt(record.release_year, 10) < decade + 10
  );

// 国フィルター関数
const countryFilter = (record, countries) =>
  countries.length === 0 || countries.includes(record.country);

// サイズフィルター関数
const sizeFilter = (record, sizes) => sizes.length === 0 || sizes.includes(record.size);

// メインフィルター関数
const filterRecords = (records, filters) => {
  const { search, genres, decades, countries, sizes } = filters;

  return records.filter(
    (record) =>
      (!search || searchTextMatch(record, search)) &&
      genreFilter(record, genres) &&
      decadeFilter(record, decades) &&
      countryFilter(record, countries) &&
      sizeFilter(record, sizes)
  );
};

// ソート関数
const sortRecords = (records, sortConfig) => {
  const { key, direction } = sortConfig;

  return [...records].sort((a, b) => {
    // アーティスト名でソートする場合は、alphabet_artistフィールドを優先的に使用
    // アルファベット表記がない場合はartistフィールドを使用
    let aValue, bValue;

    if (key === 'artist') {
      aValue = a['alphabet_artist'] || a['artist'] || '';
      bValue = b['alphabet_artist'] || b['artist'] || '';
    } else {
      aValue = a[key] || '';
      bValue = b[key] || '';
    }

    const compareValue =
      !isNaN(aValue) && !isNaN(bValue)
        ? Number(aValue) - Number(bValue)
        : String(aValue).localeCompare(String(bValue));

    return direction === 'asc' ? compareValue : -compareValue;
  });
};

// メタデータ抽出関数
const extractMetadata = (records) => {
  const extractUniqueValues = (field) =>
    [...new Set(records.map((r) => r[field]).filter(Boolean))].sort();

  const extractDecades = () =>
    [
      ...new Set(
        records
          .map((r) => r.release_year)
          .filter((year) => year)
          .map((year) => Math.floor(parseInt(year, 10) / 10) * 10)
      ),
    ].sort();

  return {
    genres: extractUniqueValues('genre'),
    countries: extractUniqueValues('country'),
    decades: extractDecades(),
    sizes: extractUniqueValues('size'),
  };
};

export const useRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    genres: [],
    decades: [],
    countries: [],
    sizes: [],
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'artist',
    direction: 'asc',
  });

  // レコード取得
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await getRecords();
        setRecords(data);
        setError(null);
      } catch (err) {
        setError('レコードデータの取得に失敗しました');
        console.error('レコード取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // フィルタリングとソートされたレコード
  const filteredRecords = useMemo(() => {
    const filtered = filterRecords(records, filters);
    return sortRecords(filtered, sortConfig);
  }, [records, filters, sortConfig]);

  // メタデータ取得
  const getMetadata = () => extractMetadata(records);

  // レコード操作ハンドラ
  const handleRecordSelect = (record) => setSelectedRecord(record);
  const handleCloseDetail = () => setSelectedRecord(null);

  const handleAddRecord = async (newRecord) => {
    try {
      const addedRecord = await addRecord(newRecord);
      setRecords((prev) => [...prev, addedRecord]);
      return addedRecord;
    } catch (err) {
      console.error('レコード追加エラー:', err);
      throw new Error('レコードの追加に失敗しました');
    }
  };

  const handleUpdateRecord = async (id, updatedRecord) => {
    try {
      const result = await updateRecord(id, updatedRecord);
      setRecords((prev) => prev.map((record) => (record.id === id ? result : record)));
      setSelectedRecord(result);
      return result;
    } catch (err) {
      console.error('レコード更新エラー:', err);
      throw new Error('レコードの更新に失敗しました');
    }
  };

  const handleRecordDelete = async (id) => {
    try {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((record) => record.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error('レコード削除エラー:', err);
      throw new Error('レコードの削除に失敗しました');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return {
    records,
    filteredRecords,
    selectedRecord,
    loading,
    error,
    filters,
    sortConfig,
    handleFilterChange,
    handleSort,
    handleRecordSelect,
    handleRecordDelete,
    handleAddRecord,
    handleCloseDetail,
    getMetadata,
    handleUpdateRecord,
  };
};
