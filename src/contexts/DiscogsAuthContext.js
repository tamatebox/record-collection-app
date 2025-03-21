import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  saveDiscogsToken, 
  removeDiscogsToken, 
  getDiscogsToken,
  authenticate,
  performAutoAuth
} from '../utils/discogsAuth';

// コンテキストの作成
const DiscogsAuthContext = createContext();

// コンテキストプロバイダー
export const DiscogsAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初期化時に認証状態をチェックと自動認証
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 最初に保存されたトークンをチェック
        const token = getDiscogsToken();
        if (token) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        
        // トークンがない場合は自動認証を試行
        const autoToken = await authenticate();
        setIsAuthenticated(!!autoToken);
      } catch (error) {
        console.error('認証初期化エラー:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // メッセージイベントリスナーの設定
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data && event.data.type === 'DISCOGS_AUTH_CODE') {
        // 認証コードを受け取った後の状態更新
        setIsAuthenticated(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    removeDiscogsToken();
    setIsAuthenticated(false);
  }, []);

  // トークンの設定
  const setToken = useCallback((token) => {
    if (token) {
      saveDiscogsToken(token);
      setIsAuthenticated(true);
    } else {
      removeDiscogsToken();
      setIsAuthenticated(false);
    }
  }, []);

  // エラー状態のクリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 自動認証を実行する関数
  const performAutomaticAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await performAutoAuth();
      setToken(token);
      return token;
    } catch (error) {
      console.error('自動認証エラー:', error);
      setError(`自動認証に失敗しました: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setToken]);

  // コンテキスト値の定義
  const value = {
    isAuthenticated,
    loading,
    error,
    setToken,
    logout,
    clearError,
    performAutomaticAuth
  };

  return (
    <DiscogsAuthContext.Provider value={value}>
      {children}
    </DiscogsAuthContext.Provider>
  );
};

// カスタムフック
export const useDiscogsAuth = () => {
  const context = useContext(DiscogsAuthContext);
  if (!context) {
    throw new Error('useDiscogsAuth must be used within a DiscogsAuthProvider');
  }
  return context;
};

export default DiscogsAuthContext;
