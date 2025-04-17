import axios from 'axios';

// APIベースURLを環境に応じて設定
const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:3001/api';

// 自動認証用のキー
const DISCOGS_AUTO_CONNECTED_KEY = 'discogs_auto_connected';

// トークン保存のキー
const DISCOGS_TOKEN_KEY = 'discogs_access_token';

/**
 * トークンをローカルストレージに保存
 * @param {string} token - 保存するアクセストークン
 */
export const saveDiscogsToken = (token) => {
  localStorage.setItem(DISCOGS_TOKEN_KEY, token);
};

/**
 * ローカルストレージからトークンを取得
 * @returns {string|null} トークン値、存在しない場合はnull
 */
export const getDiscogsToken = () => {
  return localStorage.getItem(DISCOGS_TOKEN_KEY);
};

/**
 * ローカルストレージからトークンを削除
 */
export const removeDiscogsToken = () => {
  localStorage.removeItem(DISCOGS_TOKEN_KEY);
};

/**
 * 認証状態を確認
 * @returns {boolean} 認証済みならtrue
 */
export const isDiscogsAuthenticated = () => {
  return !!getDiscogsToken();
};

/**
 * API呼び出し用のヘッダーを作成
 * @returns {Object} 認証ヘッダーを含むオブジェクト
 */
export const getAuthHeaders = () => {
  const token = getDiscogsToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 自動認証パーソナルアクセストークンによる認証
 * @returns {Promise<string>} 取得したアクセストークン
 * @throws {Error} 認証プロセス中のエラー
 */
export const performAutoAuth = async () => {
  try {
    // 既に保存されたトークンがあれば、それを使用
    const existingToken = getDiscogsToken();
    if (existingToken) {
      return existingToken;
    }

    // 自動認証がキャッシュされている場合はスキップ
    // if (localStorage.getItem(DISCOGS_AUTO_CONNECTED_KEY) === 'failed') {
    //   throw new Error('自動認証は以前失敗しています');
    // }

    // 環境変数のトークンを取得
    const response = await axios.get(`${API_BASE_URL}/discogs/token`);
    const { accessToken } = response.data;

    if (!accessToken) {
      throw new Error('自動認証でトークンを取得できませんでした');
    }

    // トークンを保存
    saveDiscogsToken(accessToken);
    localStorage.setItem(DISCOGS_AUTO_CONNECTED_KEY, 'success');

    return accessToken;
  } catch (error) {
    console.error('トークン取得エラー:', error);
    // 失敗を記録
    localStorage.setItem(DISCOGS_AUTO_CONNECTED_KEY, 'failed');
    throw error;
  }
};

/**
 * Discogs認証プロセスを開始 (手動認証は無効化されています)
 * @returns {Promise<string>} 取得したアクセストークン
 * @throws {Error} 認証プロセス中のエラー
 */
export const initiateDiscogsAuth = async () => {
  try {
    // 既に保存されたトークンがあれば、それを使用
    const existingToken = getDiscogsToken();
    if (existingToken) {
      return existingToken;
    }

    // 手動認証は無効化されているため、代わりに自動認証を実行
    return performAutoAuth();
  } catch (error) {
    console.error('Discogs認証エラー:', error);
    throw error;
  }
};

/**
 * ユーザー情報の取得
 * @returns {Promise<Object>} ユーザー情報
 */
export const getUserIdentity = async () => {
  try {
    // 認証確認
    if (!isDiscogsAuthenticated()) {
      await performAutoAuth(); // 手動認証ではなく自動認証を使用
    }

    const response = await axios.get(`${API_BASE_URL}/discogs/identity`);
    return response.data;
  } catch (error) {
    // 認証エラーの場合はトークンを削除
    if (error.response && error.response.status === 401) {
      removeDiscogsToken();
    }
    throw error;
  }
};

/**
 * Discogsでの検索
 * @param {string} query - 検索クエリ
 * @param {Object} options - 検索オプション
 * @returns {Promise<Object>} 検索結果
 */
export const discogsSearch = async (query, options = {}) => {
  try {
    // 認証確認
    if (!isDiscogsAuthenticated()) {
      await performAutoAuth(); // 手動認証ではなく自動認証を使用
    }

    // 検索リクエスト
    const response = await axios.get(`${API_BASE_URL}/discogs/search`, {
      params: {
        query,
        ...options,
      },
    });

    return response.data;
  } catch (error) {
    // 認証エラーの場合はトークンを削除して再試行
    if (error.response && error.response.status === 401) {
      removeDiscogsToken();
      // 再帰呼び出しは最大1回に制限
      if (!options._retried) {
        return discogsSearch(query, { ...options, _retried: true });
      }
    }
    throw error;
  }
};

/**
 * リリース詳細の取得
 * @param {string} id - リリースID
 * @returns {Promise<Object>} リリース詳細
 */
export const getDiscogsRelease = async (id) => {
  try {
    // 認証確認
    if (!isDiscogsAuthenticated()) {
      await performAutoAuth(); // 手動認証ではなく自動認証を使用
    }

    // リリース詳細リクエスト
    const response = await axios.get(`${API_BASE_URL}/discogs/release/${id}`);
    return response.data;
  } catch (error) {
    // 認証エラーの場合はトークンを削除して再試行
    if (error.response && error.response.status === 401) {
      removeDiscogsToken();
      // 再帰呼び出しは最大1回に制限
      return getDiscogsRelease(id, { _retried: true });
    }
    throw error;
  }
};

/**
 * 認証状態のチェック
 * トークンの有効性を確認するためにユーザー情報を取得
 * @returns {Promise<boolean>} 認証が有効ならtrue
 */
export const validateAuthentication = async () => {
  if (!isDiscogsAuthenticated()) {
    return false;
  }

  try {
    await getUserIdentity();
    return true;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      removeDiscogsToken();
    }
    return false;
  }
};

/**
 * 認証を行う関数
 * 自動認証のみを使用
 * @returns {Promise<string|null>} 取得したトークンまたはnull
 */
export const authenticate = async () => {
  // 既存のトークンをチェック
  if (isDiscogsAuthenticated()) {
    return getDiscogsToken();
  }

  try {
    // 自動認証を試行
    return await performAutoAuth();
  } catch (error) {
    console.error('自動認証失敗、トークンは利用できません');
    // 自動認証が失敗した場合はトークンなしを返す
    return null;
  }
};
