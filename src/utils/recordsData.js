import records from '../extracted_records.json';

export const getRecords = () => {
  return records;
};

export const getGenres = () => {
  const genres = [...new Set(records.map(record => record.genre))];
  return genres.sort();
};

export const getCountries = () => {
  const countries = [...new Set(records.map(record => record.country))];
  return countries.sort();
};

export const getDecades = () => {
  const years = records
    .map(record => record.release_year)
    .filter(year => year !== null && year !== "")
    .map(year => parseInt(year, 10))
    .filter(year => !isNaN(year));
  
  const decades = [...new Set(years.map(year => Math.floor(year / 10) * 10))];
  return decades.sort();
};

export const getSizes = () => {
  const sizes = [...new Set(records.map(record => record.size))];
  return sizes.sort();
};
