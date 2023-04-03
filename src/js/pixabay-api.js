import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33991160-081e616815ce3868e88aa394f';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  fetchImages() {
    // console.log(this);
    const searchParams = new URLSearchParams({
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: this.per_page,
      page: this.page,
    });

    const url = `${BASE_URL}/?key=${API_KEY}&${searchParams}`;
    // const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;

    // ===== Метод fetch() для GET-запиту =====
    // return fetch(url)
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(response.status);
    //     }

    //     return response.json();
    //   })
    //   .then(data => {
    //     // console.log(data);

    //     this.incrementPage();

    //     return data.hits;
    //   });

    // ===== Бібліотека axios для HTTP-запиту =====
    return axios
      .get(url)
      .then(({ data }) => {
        // console.log(data);
        if (data.hits.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }

        this.incrementPage();

        return data.hits;
      })
      .catch(error => {
        throw new Error(error.response.status);
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
