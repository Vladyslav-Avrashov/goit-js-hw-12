import { fetchImages } from './js/pixabay-api';
import { renderImages, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const refs = {
  form: document.querySelector('.form'),
  input: document.querySelector('[name="search-text"]'),
  loader: document.querySelector('.loader'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let searchQuery = '';
let page = 1;
const perPage = 15;
let totalHits = 0;
refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
async function onSearch(event) {
  event.preventDefault();
  searchQuery = refs.input.value.trim();
  if (!searchQuery) {
    iziToast.error({ message: 'Please enter a search query!' });
    return;
  }
  page = 1;
  clearGallery();
  refs.loadMoreBtn.style.display = 'none';
  try {
    refs.loader.style.display = 'block';
    const data = await fetchImages(searchQuery, page, perPage);
    totalHits = data.totalHits;
    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
    renderImages(data.hits);
    if (page * perPage < totalHits) {
      refs.loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong. Try again later!' });
  } finally {
    refs.loader.style.display = 'none';
  }
}
async function onLoadMore() {
  page++;
  try {
    refs.loader.style.display = 'block';
    const data = await fetchImages(searchQuery, page, perPage);
    renderImages(data.hits);
    smoothScroll();
    if (page * perPage >= totalHits) {
      refs.loadMoreBtn.style.display = 'none';
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong. Try again later!' });
  } finally {
    refs.loader.style.display = 'none';
  }
}
function smoothScroll() {
  const { height } = refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
