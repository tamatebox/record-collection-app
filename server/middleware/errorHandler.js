const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // エラーの種類に応じた適切なステータスコードと詳細を返す
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'サーバー内部でエラーが発生しました',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
