/**
 * タイトル文字列からアーティスト名とアルバム名を分割する関数
 * 例: "Nirvana - Nevermind" -> ["Nirvana", "Nevermind"]
 * @param {string} title - 分割するタイトル文字列
 * @returns {Array} - [アーティスト名, アルバム名]
 */
export const splitTitle = (title) => {
  if (!title) return ['', ''];

  // "Artist - Album" 形式を探す
  const separatorMatch = title.match(/(.+?)\s*-\s*(.+)/);
  if (separatorMatch && separatorMatch.length >= 3) {
    return [separatorMatch[1].trim(), separatorMatch[2].trim()];
  }

  // 分割できない場合は全体をアーティスト名として扱う
  return [title, ''];
};

/**
 * Discogsの検索結果からアプリ用のレコードデータに変換する関数
 * @param {Object} result - Discogsの検索結果オブジェクト
 * @returns {Object} - アプリ形式のレコードデータ
 */
export const mapDiscogsSearchResultToRecord = (result) => {
  // タイトルからアーティストとアルバム名を抽出
  const [artist, albumName] = splitTitle(result.title);

  // ジャンルとスタイルを結合
  const genres = [];
  if (result.genre) {
    if (Array.isArray(result.genre)) genres.push(...result.genre);
    else genres.push(result.genre);
  }
  const primaryGenre = genres[0] || '';

  // フォーマット情報を配列化
  const format = Array.isArray(result.format)
    ? result.format
    : result.format
      ? [result.format]
      : [];

  // レーベル情報を取得
  const label =
    Array.isArray(result.label) && result.label.length > 0 ? result.label[0] : result.label || '';

  return {
    artist: artist,
    album_name: albumName,
    release_year: result.year?.toString() || '',
    genre: primaryGenre,
    country: result.country || '',
    size: determineSearchSize(format),
    label: label,
    compilation: isSearchCompilation(artist, format),
    star: '',
    review: '',
    alphabet_artist: artist,
    music_link: '',
    acquisition_date: new Date().toISOString().split('T')[0],
    storage_location: '自宅',
    catalog_number: result.catno || '',
    discogsId: result.id,
    coverImage: result.coverImage || result.thumb || '',
  };
};

// 検索結果からサイズを判定する関数
const determineSearchSize = (format) => {
  const formatStr = format.join(' ');
  if (formatStr.includes('7"')) return '7';
  if (formatStr.includes('10"')) return '10';
  return '12'; // デフォルト
};

// 検索結果からコンピレーションかどうかを判定する関数
const isSearchCompilation = (artist, format) => {
  const formatStr = format.join(' ');
  if (formatStr.toLowerCase().includes('compilation')) return 1;

  if (
    artist.toLowerCase().includes('various') ||
    artist.toLowerCase().includes('v.a') ||
    artist.toLowerCase().includes('v/a')
  ) {
    return 1;
  }

  return 0;
};
