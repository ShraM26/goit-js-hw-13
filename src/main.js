import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import {processHttpRequest} from './js/pixabay-api';
import { imgTemplate } from './js/render-functions';

const formElms = document.querySelector('.form');
const loader = document.querySelector('.loader');
const galleryElm = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

const lightbox = new SimpleLightbox('.gallery a', {
                         captionDelay: 250,
                         captionsData: 'alt',
});
 
let page = 1;
let inputValue;
// ===========================================================================================
formElms.addEventListener('submit', (e) => {
  e.preventDefault();
  
  inputValue = formElms.elements['input'].value.trim();
  
  if (!inputValue) {
       iziToast.error({
                    message: 'Before executing the request, please enter its title!',
                    messageColor: '#FAFAFB',
                    backgroundColor: '#EF4040',
                    iconColor: '#FAFAFB',
                    position: 'topRight',
                    timeout: 3000,
                    theme: 'dark',
                    maxWidth: 450
                });
    return;
  }
  loader.style.display = 'block';
  processHttpRequest(inputValue) 
     
  .then((data) => {
            galleryElm.innerHTML = '';
            page = 1; 
    
    if (data && data.hits.length === 0) {
                iziToast.error({
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    messageColor: '#FAFAFB',
                    backgroundColor: '#EF4040',
                    iconColor: '#FAFAFB',
                    position: 'topRight',
                    timeout: 3000,
                    theme: 'dark',
                    maxWidth: 450
                }); galleryElm.innerHTML = '';
                    
            }
            else {
                   imgTemplate(data.hits)
                  lightbox.refresh();
                  loadMoreBtn.style.display = 'block';
              }
    
    loader.style.display = 'none';
    formElms.reset();

  })
  .catch((error) => {
            console.log(error);
           });
// ==========================================================================================
  loadMoreBtn.addEventListener('click', (e) => {
     
              page += 1;
             
    processHttpRequest(inputValue, page)
    
      .then((data) => {
        imgTemplate(data.hits);
        lightbox.refresh();
           
            const galleryItems = document.querySelectorAll('.gallery-item');
            const lastGalleryItem = galleryItems[galleryItems.length - 1];
            const galleryItemHeight = lastGalleryItem.getBoundingClientRect().height;

            window.scrollBy({
                top: galleryItemHeight * 2, // Переміщуємо на дві висоти карточки галереї вниз
                behavior: 'smooth'
            });
              
         if (data.totalHits <= page * 15) {
           loadMoreBtn.style.display = 'none';
           
          iziToast.info({
            message: "We're sorry, but you've reached the end of search results.",
            messageColor: '#FAFAFB',
            backgroundColor: '#8A2BE2',
            iconColor: '#FAFAFB',
            position: 'topRight',
            timeout: 3000,
            theme: 'dark',
            maxWidth: 450
          })
           
         }
        })
            .catch((error) => {
            console.log(error);
           });
  
   });

});
