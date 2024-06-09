import axios from 'axios';

async function searchImage(query, page) {
  const BASE_URL = 'https://pixabay.com/api/';

  const params = new URLSearchParams({
    key: '44039917-a1e08adf8a4d452f4e6ec8aba',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 15,
  });

  const url = `${BASE_URL}?${params}`;
  const loader = document.querySelector('.loader');
  loader.classList.remove('is-hidden');
  loader.textContent = 'Loading images, please wait...';

  const { data } = await axios.get(`${BASE_URL}?${params}`);
  return data;
}
export { searchImage };
