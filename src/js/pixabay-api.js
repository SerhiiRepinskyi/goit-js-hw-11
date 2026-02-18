import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '33991160-081e616815ce3868e88aa394f';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchImages() {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: this.perPage,
          page: this.page,
        },
      });

      this.incrementPage();

      return {
        hits: response.data.hits,
        totalHits: response.data.totalHits,
      };
    } catch (error) {
      if (error.response) {
        throw new Error(`HTTP error: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Network error');
      } else {
        throw new Error(error.message);
      }
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
