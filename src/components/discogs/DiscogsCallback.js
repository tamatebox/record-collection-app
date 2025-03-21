import React from 'react';
import { Navigate } from 'react-router-dom';

// OAuth認証は無効化されたため、このページはリダイレクトのみを行う
const DiscogsCallback = () => {
  return (
    <div>
      <h2>認証方法が変更されました</h2>
      <p>このアプリケーションは自動認証のみを使用します。</p>
      <p>5秒後にホームページにリダイレクトします...</p>
      <Navigate to="/" replace={true} />
    </div>
  );
};

export default DiscogsCallback;
