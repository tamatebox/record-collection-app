import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// レコードの取得
export const getRecords = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/records`);
    return response.data;
  } catch (error) {
    console.error('レコードの取得中にエラーが発生しました:', error);
    throw error;
  }
};

// レコードの詳細取得
export const getRecordById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/records/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID ${id} のレコード取得中にエラーが発生しました:`, error);
    throw error;
  }
};

// レコードの追加
export const addRecord = async (recordData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/records`, recordData);
    return response.data;
  } catch (error) {
    console.error('レコードの追加中にエラーが発生しました:', error);
    throw error;
  }
};

// レコードの更新
export const updateRecord = async (id, recordData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/records/${id}`, recordData);
    return response.data;
  } catch (error) {
    console.error(`ID ${id} のレコード更新中にエラーが発生しました:`, error);
    throw error;
  }
};

// レコードの削除
export const deleteRecord = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/records/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID ${id} のレコード削除中にエラーが発生しました:`, error);
    throw error;
  }
};

// Discogs API関連の関数

// Discogsでレコードを検索
export const searchDiscogs = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discogs/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Discogs検索中にエラーが発生しました:', error);
    throw error;
  }
};

// Discogsからリリース詳細を取得
export const getDiscogsRelease = async (releaseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discogs/release/${releaseId}`);
    return response.data;
  } catch (error) {
    console.error(`リリースID ${releaseId} の取得中にエラーが発生しました:`, error);
    throw error;
  }
};
