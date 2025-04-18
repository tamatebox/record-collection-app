import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import DiscogsSearch from '../../discogs/DiscogsSearch';
import RecordStars from '../../common/RecordStars';
import DefaultRecordImage from '../../../assets/default-record.svg';
import '../../../styles/components/records/recordDetail.css';

/**
 * 改良版レコードフォーム - 詳細画面のUIに合わせた編集フォーム
 */
const RecordForm = forwardRef(
  (
    {
      mode = 'add',
      initialRecord = null,
      onSubmit,
      onCancel,
      genres = [],
      countries = [],
      isDiscogsAvailable = false,
    },
    ref
  ) => {
    // 初期状態の設定
    const [formData, setFormData] = useState(
      mode === 'edit' && initialRecord
        ? { ...initialRecord }
        : {
            artist: '',
            album_name: '',
            release_year: '',
            genre: '',
            country: '',
            size: '12',
            label: '',
            compilation: false,
            star: '',
            review: '',
            alphabet_artist: '',
            music_link: '',
            acquisition_date: new Date().toISOString().split('T')[0],
            storage_location: '自宅',
            catalog_number: '',
          }
    );

    // Discogsから情報が読み込まれたかを記録
    const [isDiscogsDataLoaded, setIsDiscogsDataLoaded] = useState(false);

    // 画像関連の状態
    const [imageError, setImageError] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    // モバイル表示判定
    const [isMobile, setIsMobile] = useState(false);

    // モバイル判定
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // 初期チェック
      checkMobile();

      // リサイズイベント時に再計算
      window.addEventListener('resize', checkMobile);

      // クリーンアップ
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }, []);

    // 編集モードの場合、DBからの画像パスを使用
    useEffect(() => {
      // 初期化時にレコードの画像パスがあれば使用する
      if (mode === 'edit' && initialRecord && initialRecord.full_image) {
        // 最初にエラー状態をリセット
        setImageError(false);
      }
    }, [mode, initialRecord]);

    // 画像読み込みエラーハンドラー
    const handleImageError = () => {
      setImageError(true);
    };

    // Discogsからレコードの選択があった場合にフォームに反映
    const handleDiscogsSelect = (discogsRecord) => {
      setFormData((prev) => ({
        ...prev,
        ...discogsRecord,
        compilation: Boolean(discogsRecord.compilation),
      }));

      // Discogsからデータが読み込まれたことを記録
      setIsDiscogsDataLoaded(true);

      // Discogsから画像URLがある場合、プレビューを設定
      if (discogsRecord.coverImage) {
        setImagePreview(discogsRecord.coverImage);
      }
    };

    // 画像アップロードハンドラー
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // ファイルサイズチェック (2MB制限)
      if (file.size > 2 * 1024 * 1024) {
        alert('ファイルサイズは2MB以内にしてください');
        return;
      }

      // 画像プレビュー生成
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);

      // ファイル保存
      setImageFile(file);

      // Discogsからの画像URLがある場合、それをクリア
      if (formData.coverImage) {
        setFormData((prev) => ({
          ...prev,
          coverImage: null,
        }));
      }
    };

    // フォーム項目変更ハンドラー
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };

    // 星評価の変更を処理するハンドラー
    const handleStarChange = (rating) => {
      setFormData({
        ...formData,
        star: rating.toString(),
      });
    };

    // フォーム送信ハンドラー
    const handleSubmit = (e) => {
      e.preventDefault();

      // FormDataオブジェクトを作成して画像とデータを追加
      const submitData = new FormData();

      // JSONデータの追加
      submitData.append('data', JSON.stringify(formData));

      // 画像ファイルの追加（あれば）
      if (imageFile) {
        submitData.append('coverImage', imageFile);
      }
      // Discogsからの画像URLがある場合（アップロードされた画像がない場合）
      else if (formData.coverImage && !imagePreview) {
        submitData.append('coverImageUrl', formData.coverImage);
      }

      onSubmit(submitData);
    };

    // 親コンポーネントに公開する関数
    useImperativeHandle(ref, () => ({
      // フォーム送信関数を公開
      submitForm: () => {
        handleSubmit({
          preventDefault: () => {}, // ダミーのイベントオブジェクト
        });
      },
    }));

    // 画像コンテナのスタイル
    const imageContainerStyle = {
      width: '200px',
      height: '200px',
      overflow: 'hidden',
      borderRadius: '8px',
      flexShrink: 0,
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    };

    // 画像のスタイル
    const imageStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
    };

    // 入力フィールドクラス名
    const getInputClassName = (fieldId) => {
      if (fieldId === 'required') {
        return 'form-input required';
      }
      return 'form-input';
    };

    return (
      <form id="record-form" onSubmit={handleSubmit} className="record-detail-container">
        {/* Discogs検索セクション */}
        {isDiscogsAvailable && (
          <div className="discogs-search-section">
            <DiscogsSearch onSelectRecord={handleDiscogsSelect} onCancel={null} />
          </div>
        )}

        {/* Discogsデータ読み込み通知 */}
        {isDiscogsDataLoaded && (
          <div className="discogs-data-loaded-notification">
            <i className="check-icon">✓</i>{' '}
            Discogsからレコード情報を取得しました。必要に応じて編集してください。
          </div>
        )}

        {/* ヘッダー部分: アルバム情報と画像 */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            marginBottom: '20px',
            alignItems: isMobile ? 'center' : 'flex-start',
            overflow: 'hidden',
          }}
        >
          {/* 画像表示エリア */}
          <div style={imageContainerStyle}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={`${formData.album_name || 'レコード'} のジャケット（プレビュー）`}
                style={imageStyle}
              />
            ) : mode === 'edit' && initialRecord && initialRecord.full_image ? (
              <img
                src={imageError ? DefaultRecordImage : initialRecord.full_image}
                alt={`${formData.album_name || 'レコード'} のジャケット`}
                style={imageStyle}
                onError={handleImageError}
              />
            ) : (
              <div
                style={{
                  ...imageStyle,
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: '#666',
                }}
              >
                <span>画像なし</span>
              </div>
            )}

            {/* 画像アップロードボタン */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                zIndex: 10,
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
                title="画像をアップロード"
              >
                +
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* タイトル情報入力エリア */}
          <div
            style={{
              marginTop: isMobile ? '15px' : '0',
              marginLeft: isMobile ? '0' : '20px',
              textAlign: isMobile ? 'center' : 'left',
              flex: 1,
            }}
          >
            {/* アルバム名入力 */}
            <div className="title-input-group">
              <input
                type="text"
                id="album_name"
                name="album_name"
                value={formData.album_name || ''}
                onChange={handleChange}
                required={true}
                placeholder="アルバム名"
                className="album-title-input"
                style={{
                  fontSize: '1.8rem',
                  marginBottom: '10px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                }}
              />
            </div>

            {/* アーティスト名入力 */}
            <div className="artist-input-group">
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist || ''}
                onChange={handleChange}
                required={true}
                placeholder="アーティスト名"
                className="artist-name-input"
                style={{
                  fontSize: '1.4rem',
                  marginBottom: '6px',
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                }}
              />
            </div>

            {/* アーティスト名（英字）入力 */}
            <div className="alphabet-artist-input-group">
              <input
                type="text"
                id="alphabet_artist"
                name="alphabet_artist"
                value={formData.alphabet_artist || ''}
                onChange={handleChange}
                placeholder="アーティスト名(英字)"
                className="alphabet-artist-input"
                style={{
                  fontSize: '0.9rem',
                  marginBottom: '10px',
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontStyle: 'italic',
                }}
              />
            </div>

            {/* 評価入力 */}
            <div
              className="record-rating"
              style={{ justifyContent: isMobile ? 'center' : 'flex-start' }}
            >
              <label style={{ marginRight: '10px', fontSize: '0.9rem', color: '#666' }}>
                評価:
              </label>
              <RecordStars rating={formData.star} onChange={handleStarChange} />
            </div>
          </div>
        </div>

        <div className="record-sections">
          {/* 基本情報とコレクション情報 */}
          <div className="section-row">
            <div className="record-section">
              <h4 className="section-title">基本情報</h4>
              <table className="info-table">
                <tbody>
                  <tr className="info-row">
                    <td className="info-label">ジャンル</td>
                    <td className="info-value">
                      <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={formData.genre || ''}
                        onChange={handleChange}
                        placeholder="例: Rock, Jazz, Classical"
                        className="form-input"
                      />
                    </td>
                  </tr>
                  <tr className="info-row">
                    <td className="info-label">発売年</td>
                    <td className="info-value">
                      <input
                        type="text"
                        id="release_year"
                        name="release_year"
                        value={formData.release_year || ''}
                        onChange={handleChange}
                        placeholder="例: 1985"
                        className="form-input"
                      />
                    </td>
                  </tr>
                  <tr className="info-row">
                    <td className="info-label">国</td>
                    <td className="info-value">
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleChange}
                        placeholder="例: JP, UK, US"
                        className="form-input"
                      />
                    </td>
                  </tr>
                  <tr className="info-row">
                    <td className="info-label">サイズ</td>
                    <td className="info-value">
                      <select
                        id="size"
                        name="size"
                        value={formData.size || '12'}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="7">7"</option>
                        <option value="10">10"</option>
                        <option value="12">12"</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="info-row">
                    <td className="info-label">コンピレーション</td>
                    <td className="info-value">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="compilation"
                          checked={formData.compilation || false}
                          onChange={handleChange}
                          id="compilation"
                        />
                        <span className="checkbox-text">はい</span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="record-section">
              <h4 className="section-title">コレクション情報</h4>
              <table className="info-table">
                <tbody>
                  <tr className="info-row">
                    <td className="info-label">取得日</td>
                    <td className="info-value">
                      <input
                        type="date"
                        id="acquisition_date"
                        name="acquisition_date"
                        value={formData.acquisition_date || ''}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </td>
                  </tr>
                  <tr className="info-row">
                    <td className="info-label">保管場所</td>
                    <td className="info-value">
                      <input
                        type="text"
                        id="storage_location"
                        name="storage_location"
                        value={formData.storage_location || ''}
                        onChange={handleChange}
                        placeholder="例: 自宅、書斎"
                        className="form-input"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 出版情報とレビュー */}
          <div className="section-row">
            <div className="record-section">
              <h4 className="section-title">出版情報</h4>
              <table className="info-table">
                <tbody>
                  <tr className="info-row">
                    <td className="info-label">レーベル</td>
                    <td className="info-value">
                      <input
                        type="text"
                        id="label"
                        name="label"
                        value={formData.label || ''}
                        onChange={handleChange}
                        placeholder="例: Columbia, EMI"
                        className="form-input"
                      />
                    </td>
                  </tr>
                  <tr className="info-row">
                    <td className="info-label">カタログ番号</td>
                    <td className="info-value">
                      <input
                        type="text"
                        id="catalog_number"
                        name="catalog_number"
                        value={formData.catalog_number || ''}
                        onChange={handleChange}
                        placeholder="例: ABC-123"
                        className="form-input"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="record-section">
              <h4 className="section-title">レビュー</h4>
              <textarea
                id="review"
                name="review"
                value={formData.review || ''}
                onChange={handleChange}
                rows={4}
                className="review-textarea"
                placeholder="レコードについての感想や詳細を入力"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                }}
              />
            </div>
          </div>

          {/* 試聴リンク */}
          <div className="section-row">
            <div className="record-section">
              <h4 className="section-title">試聴リンク</h4>
              <input
                type="url"
                id="music_link"
                name="music_link"
                value={formData.music_link || ''}
                onChange={handleChange}
                placeholder="例: https://open.spotify.com/album/..."
                className="full-width-input"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                }}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
);

export default RecordForm;
