import React from 'react';
import { useDiscogsAuth } from '../contexts/DiscogsAuthContext';

// このコンポーネントは自動認証に失敗した場合のエラー表示のみを行う
const DiscogsAuthButton = ({ className, onRetry }) => {
  const { error, loading, performAutomaticAuth } = useDiscogsAuth();

  // エラーがない場合は何も表示しない
  if (!error) {
    return null;
  }

  const handleRetry = async () => {
    try {
      await performAutomaticAuth();
      if (onRetry) onRetry();
    } catch (err) {
      // エラーはContext内で処理されるため、ここでは何もしない
    }
  };

  return (
    <div className={className || 'discogs-auth-error'}>
      <div className="error-container" style={{
        padding: '15px',
        backgroundColor: '#fff8f8',
        border: '1px solid #ffcdd2',
        borderRadius: '4px',
        margin: '10px 0',
        color: '#d32f2f'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Discogs接続エラー</h3>
        <p>環境変数に正しいトークンが設定されていない可能性があります。</p>
        <ol style={{ marginLeft: '20px', paddingLeft: '0' }}>
          <li>Discogsアカウントにログインしてください。</li>
          <li>設定 > 開発者に移動してください。</li>
          <li>"Generate new token"ボタンをクリックしてトークンを生成してください。</li>
          <li>サーバーの`.env`ファイルに`DISCOGS_PERSONAL_ACCESS_TOKEN=生成したトークン`を設定してください。</li>
          <li>サーバーを再起動してください。</li>
        </ol>
        <button 
          onClick={handleRetry}
          className="retry-button"
          style={{
            backgroundColor: '#d32f2f',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
          disabled={loading}
        >
          {loading ? '再試行中...' : '再試行'}
        </button>
      </div>
    </div>
  );
};

export default DiscogsAuthButton;
