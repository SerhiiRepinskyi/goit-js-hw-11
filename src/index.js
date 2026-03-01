// ================= IMPORTS =================
import './css/styles.css';

import refs from './js/refs';

import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
} from './js/notify';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayApiService from './js/pixabay-api';

// ================= INIT =================
const pixabayApiService = new PixabayApiService();

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

init();

function init() {
  refs.loadMoreBtn.classList.add('is-hidden');
  refs.searchForm.addEventListener('submit', handleSearch);
  refs.loadMoreBtn.addEventListener('click', handleLoadMore);
}

// ================= EVENT HANDLERS =================
async function handleSearch(e) {
  e.preventDefault();

  const query = e.currentTarget.elements.searchQuery.value.trim();
  pixabayApiService.query = query;

  if (!query) {
    return notifyWarning('Enter text to search the gallery.');
  }

  pixabayApiService.resetPage();
  clearGalleryContainer();

  try {
    setLoadingState(true);

    const { hits, totalHits } = await pixabayApiService.fetchImages();

    if (totalHits === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return notifyError(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    notifySuccess(`Hooray! We found ${totalHits} images.`);

    appendImagesMarkup(hits);
    checkEndOfResults(totalHits, hits.length);
  } catch (error) {
    console.error(error);
    notifyError('Something went wrong. Please try again.');
  } finally {
    setLoadingState(false);
  }
}

async function handleLoadMore() {
  setLoadingState(true);

  try {
    const { hits, totalHits } = await pixabayApiService.fetchImages();

    appendImagesMarkup(hits);
    smoothScroll();
    checkEndOfResults(totalHits, hits.length);
  } catch (error) {
    console.error(error);
    notifyError('Something went wrong. Please try again.');
  } finally {
    setLoadingState(false);
  }
}

// ================= UI HELPERS =================
function setLoadingState(isLoading) {
  refs.loadMoreBtn.disabled = isLoading;
  refs.loadMoreBtn.textContent = isLoading ? 'Loading...' : 'Load more';
}

function checkEndOfResults(totalHits, hitsLength) {
  const loadedImages = refs.divGallery.children.length;

  // Pixabay API limit
  const maxAvailable = Math.min(totalHits, 500);

  if (loadedImages >= maxAvailable || hitsLength === 0) {
    refs.loadMoreBtn.classList.add('is-hidden');
    notifyInfo("We're sorry, but you've reached the end of search results.");
  } else {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
}

// ================= RENDER =================
function appendImagesMarkup(hits) {
  const imagesMarkup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <a class="gallery-item" href="${largeImageURL}">
          <div class="photo-card">
            <img
              class="img-item"
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
            />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `
    )
    .join('');

  refs.divGallery.insertAdjacentHTML('beforeend', imagesMarkup);
  simpleLightbox.refresh();
}

// ================= UTILS =================
function clearGalleryContainer() {
  refs.divGallery.innerHTML = '';
}

function smoothScroll() {
  const firstCard = refs.divGallery.firstElementChild;
  if (!firstCard) return;

  const { height: cardHeight } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
