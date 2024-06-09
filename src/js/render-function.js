function imageTemplate(image) {
  return `<li class="gallery-item" data-id="${image.id}">
        <div class="img-container" >
        <a class="large-image" href="${image.largeImageURL}">
        <img class="image" src="${image.webformatURL}" alt="${image.tags}">
        </a> 
        </div>
        <ul class="description-list" >
          <li class="description-item"><p class="description-item-text">Likes</p><p class="description-item-numb">${image.likes}</p></li>
          <li class="description-item"><p class="description-item-text">Views</p><p class="description-item-numb">${image.views}</p></li>
          <li class="description-item"><p class="description-item-text">Comments</p><p class="description-item-numb">${image.comments}</p></li>
          <li class="description-item"><p class="description-item-text">Downloads</p><p class="description-item-numb">${image.downloads}</p></li>
        </ul>
      </li>`;
}
export function imagesTemplate(arr) {
  return arr.map(imageTemplate).join('');
}
