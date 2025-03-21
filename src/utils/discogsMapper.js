/**
 * Discogsのリリースデータからアプリ用のレコードデータに変換する関数
 */
export const mapDiscogsReleaseToRecord = (release) => {
  // 最初のアーティスト名を取得
  const artistName = release.artists?.[0]?.name?.replace(/\s*\(\d+\)$/, '') || '';
  
  // 最初のレーベル情報を取得
  const labelInfo = release.labels?.[0] || {};
  
  // ジャンルとスタイルを結合
  const genres = [...(release.genres || []), ...(release.styles || [])];
  const primaryGenre = genres[0] || '';
  
  // フォーマット情報からレコードサイズを判定
  const size = determineSize(release);
  
  return {
    artist: artistName,
    album_name: release.title || '',
    release_year: release.year?.toString() || '',
    genre: primaryGenre,
    country: release.country || '',
    size: size,
    label: labelInfo.name || '',
    compilation: isCompilation(release) ? 1 : 0,
    star: '',
    review: '',
    // アーティスト名をアルファベット表記としてそのまま使用
    alphabet_artist: artistName,
    music_link: release.resource_url || '',
    acquisition_date: new Date().toISOString().split('T')[0],
    storage_location: '自宅',
    catalog_number: labelInfo.catno || '',
    // 追加情報
    discogsId: release.id,
    coverImage: release.images?.[0]?.uri || ''
  };
};

/**
 * リリース情報からレコードサイズを判定する関数
 */
const determineSize = (release) => {
  const format = release.formats?.[0];
  if (format) {
    if (format.name === 'Vinyl') {
      const description = format.descriptions || [];
      if (description.includes('7"')) return '7';
      if (description.includes('10"')) return '10';
      if (description.includes('12"')) return '12';
    }
  }
  return '12'; // デフォルトは12インチ
};

/**
 * リリースがコンピレーションかどうかを判定する関数
 */
const isCompilation = (release) => {
  const format = release.formats?.[0];
  if (format?.descriptions) {
    return format.descriptions.some(
      desc => desc.toLowerCase().includes('compilation')
    );
  }
  
  // アーティスト名に "Various" が含まれる場合もコンピレーションと判定
  const artistName = release.artists?.[0]?.name || '';
  if (artistName.toLowerCase().includes('various')) {
    return true;
  }
  
  return false;
};

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
  
  // フォーマット情報からレコードサイズを推測
  let size = '12'; // デフォルト
  if (result.format) {
    const formatStr = Array.isArray(result.format) ? result.format.join(' ') : result.format;
    if (formatStr.includes('7"')) size = '7';
    if (formatStr.includes('10"')) size = '10';
  }
  
  // ジャンル処理
  let genre = '';
  if (Array.isArray(result.genre) && result.genre.length > 0) {
    genre = result.genre[0];
  } else if (typeof result.genre === 'string') {
    genre = result.genre;
  }
  
  // スタイル情報がある場合は優先的に使用
  if (Array.isArray(result.style) && result.style.length > 0) {
    genre = result.style[0];
  } else if (typeof result.style === 'string') {
    genre = result.style;
  }
  
  // レーベル情報
  let label = '';
  if (Array.isArray(result.label) && result.label.length > 0) {
    label = result.label[0];
  } else if (typeof result.label === 'string') {
    label = result.label;
  }
  
  // コンピレーション判定
  let compilation = 0;
  if (artist.toLowerCase().includes('various') || 
      artist.toLowerCase().includes('v.a') ||
      artist.toLowerCase().includes('v/a')) {
    compilation = 1;
  }
  
  return {
    artist: artist,
    album_name: albumName,
    release_year: result.year?.toString() || '',
    genre: genre,
    country: result.country || '',
    size: size,
    label: label,
    compilation: compilation,
    star: '',
    review: '',
    alphabet_artist: artist,
    music_link: result.resourceUrl || '',
    acquisition_date: new Date().toISOString().split('T')[0],
    storage_location: '自宅',
    catalog_number: result.catno || '',
    // 追加情報
    discogsId: result.id,
    coverImage: result.coverImage || result.thumb || ''
  };
};