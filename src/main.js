import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { searchImage } from './js/pixabay-api';
import { imagesTemplate } from './js/render-function';

const iziToastOptions = {
  message:
    'Sorry, there are no images matching your search query. Please try again!',
  messageColor: 'white',
  messageSize: '16px',
  backgroundColor: 'red',
  position: 'topRight',
  timeout: 5000,
  drag: true,
  overlay: true,
  overlayClose: true,
};

const iziToastErr = {
  message: 'Sorry, something goes wrong!',
  backgroundColor: 'red',
  messageColor: 'white',
  position: 'topRight',
  timeout: 5000,
  drag: true,
  overlay: true,
  overlayClose: true,
};

const iziToastInfo = {
  message: "We're sorry, but you've reached the end of search results.",
  backgroundColor: 'orange',
  messageColor: 'white',
  position: 'topRight',
  timeout: 5000,
  drag: true,
  overlay: true,
  overlayClose: true,
};

const formElem = document.querySelector('.form');
const imagesList = document.querySelector('.images-container');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.more-btn');
const lightbox = new SimpleLightbox('.large-image', {
  captionDelay: 250,
  captionsData: 'alt',
});

formElem.addEventListener('submit', getImages);
loadMoreBtn.addEventListener('click', imagesMore);

function showLoadMoreBtn(show) {
  console.log(`showLoadMoreBtn called with show=${show}`);
  if (show) {
    loadMoreBtn.classList.remove('is-hidden');
  } else {
    loadMoreBtn.classList.add('is-hidden');
  }
  console.log(`LoadMoreBtn classlist: ${loadMoreBtn.classList}`);
}

let page = 1;
let totalPages = 0;
let query = '';

async function getImages(event) {
  event.preventDefault();

  imagesList.innerHTML = '';
  page = 1;

  query = event.target.elements.query.value.trim();
  if (query === '') {
    iziToast.show({
      message: 'The field cannot be empty!',
      position: 'topRight',
      backgroundColor: 'red',
    });
    return;
  }

  try {
    const data = await searchImage(query, page);

    if (data.hits.length === 0) {
      iziToast.show(iziToastOptions);
      showLoadMoreBtn(false);
    } else {
      const markup = imagesTemplate(data.hits);
      imagesList.innerHTML = markup;
      lightbox.refresh();
    }

    loader.classList.add('is-hidden');

    totalPages = Math.ceil(data.totalHits / 15);

    if (totalPages > 1) {
      showLoadMoreBtn(true);
    } else {
      showLoadMoreBtn(false);
    }
  } catch (error) {
    iziToast.show(iziToastErr);
    showLoadMoreBtn(false);
  }

  formElem.reset();
}

async function imagesMore() {
  page += 1;

  try {
    const data = await searchImage(query, page);
    const markup = imagesTemplate(data.hits);
    imagesList.innerHTML += markup;
    lightbox.refresh();

    if (page >= totalPages) {
      showLoadMoreBtn(false);
      iziToast.info(iziToastInfo);
    }
  } catch (error) {
    iziToast.show(iziToastErr);
  }
}
