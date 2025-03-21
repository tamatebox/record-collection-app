import axios from 'axios';

// デフォルトのAPIベースURL
const API_BASE_URL =
  process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : 'http://localhost:3001/api';

// Axiosインスタンスの作成
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// レコードの取得
export const getRecords = async () => {
  try {
    const response = await api.get('/records');
    return response.data;
  } catch (error) {
    console.error('レコードの取得中にエラーが発生しました:', error);
    throw error;
  }
};

// レコードの詳細取得
export const getRecordById = async (id) => {
  try {
    const response = await api.get(`/records/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID ${id} のレコード取得中にエラーが発生しました:`, error);
    throw error;
  }
};

// レコードの追加
export const addRecord = async (recordData) => {
  try {
    const response = await api.post('/records', recordData);
    return response.data;
  } catch (error) {
    console.error('レコードの追加中にエラーが発生しました:', error);
    throw error;
  }
};

// レコードの更新
export const updateRecord = async (id, recordData) => {
  try {
    const response = await api.put(`/records/${id}`, recordData);
    return response.data;
  } catch (error) {
    console.error(`ID ${id} のレコード更新中にエラーが発生しました:`, error);
    throw error;
  }
};

// レコードの削除
export const deleteRecord = async (id) => {
  try {
    const response = await api.delete(`/records/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID ${id} のレコード削除中にエラーが発生しました:`, error);
    throw error;
  }
};

// Discogsでレコードを検索
export const searchDiscogs = async (query) => {
  try {
    const response = await api.get('/discogs/search', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Discogs検索中にエラーが発生しました:', error);
    throw error;
  }
};

// Discogsからリリース詳細を取得
export const getDiscogsRelease = async (releaseId) => {
  try {
    const response = await api.get(`/discogs/release/${releaseId}`);
    return response.data;
  } catch (error) {
    console.error(`リリースID ${releaseId} の取得中にエラーが発生しました:`, error);
    throw error;
  }
};

export default api;
