const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33991160-081e616815ce3868e88aa394f';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.per_page = 40;
    this.page = 1;
  }

  fetchImages() {
    // console.log(this);

    const otherSearchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });

    const url = `${BASE_URL}//?key=${API_KEY}&q=${this.searchQuery}&${otherSearchParams}&per_page=${this.per_page}&page=${this.page}`;

    // const url = `${BASE_URL}//?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }

        return response.json();
      })
      .then(data => {
        // console.log(data);
        this.incrementPage();

        return data;
      });
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
