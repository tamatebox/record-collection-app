import React from 'react';

const ErrorView = ({ error }) => {
  return (
    <div className="error">
      <h2>エラーが発生しました</h2>
      <p>{error}</p>
      <p>サーバーが起動していることを確認してください。</p>
      <button onClick={() => window.location.reload()}>再読み込み</button>
    </div>
  );
};

export default ErrorView;
