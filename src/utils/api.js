import axios from 'axios';

// デフォルトのAPIベースURL
const API_BASE_URL = process.env.REACT_APP_API_URL
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

// FormDataを含むリクエスト用のヘッダー設定関数
const setMultipartHeaders = (config) => {
  config.headers = {
    ...config.headers,
    'Content-Type': 'multipart/form-data',
  };
  return config;
};

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

// レコードの追加（FormDataに対応）
export const addRecord = async (recordData) => {
  try {
    let response;

    // FormDataオブジェクトの場合（ファイルアップロードあり）
    if (recordData instanceof FormData) {
      response = await axios.post(`${API_BASE_URL}/records`, recordData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // 通常のJSONデータの場合
      response = await api.post('/records', recordData);
    }

    return response.data;
  } catch (error) {
    console.error('レコードの追加中にエラーが発生しました:', error);
    throw error;
  }
};

// レコードの更新（FormDataに対応）
export const updateRecord = async (id, recordData) => {
  try {
    let response;

    // FormDataオブジェクトの場合（ファイルアップロードあり）
    if (recordData instanceof FormData) {
      response = await axios.put(`${API_BASE_URL}/records/${id}`, recordData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // 通常のJSONデータの場合
      response = await api.put(`/records/${id}`, recordData);
    }

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

// Discogsの画像URLからレコード画像をダウンロード
export const downloadDiscogsImage = async (imageUrl) => {
  try {
    const response = await api.post('/discogs/download-image', { imageUrl });
    return response.data;
  } catch (error) {
    console.error('画像ダウンロード中にエラーが発生しました:', error);
    throw error;
  }
};

export default api;
