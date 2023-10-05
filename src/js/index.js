import axios from "axios";
import Notiflix from "notiflix";

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more')
const URL = 'https://pixabay.com/api/';
const KEY = '39849634-51b0690041743f79df8d2c395';
const options = {
    params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: 1,
        per_page: 40
    }
};
let totalHits = 0;
async function fetchImage(nameTag) {
    return response = await axios.get(`${URL}?key=${KEY}&q=${nameTag}`, options)
};

loadBtn.addEventListener('click', loadMore)

function loadMore() {
    const { searchQuery } = form.elements;

    fetchImage(searchQuery.value)
        .then(obj => {
            const { hits } = obj.data;
            if (hits.length === 0) {
                throw new Error();
            }
            hits.forEach(item => createMarkup(item));

            if (totalHits > 0) {
                options.params.page += 1; 
                if (options.params.page * options.params.per_page >= totalHits) {                    
                    showElement(loadBtn, false);
                    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                }
            }
        })
        .catch(error => {
            console.error(error);
            Notiflix.Notify.failure("An error occurred while loading more images.");
        });
}


function showElement(element, show) {
    if (show) {
        element.hidden = false;
    } else {
        element.hidden = true;
    }
}

form.addEventListener('submit', searchPhoto)

function searchPhoto(evt) {
    evt.preventDefault();
    const { searchQuery } = evt.currentTarget.elements;
    options.params.page = 1;

    fetchImage(searchQuery.value)
        .then(obj => {
            const { hits, totalHits: newTotalHits } = obj.data;
            if (hits.length === 0) {
                throw new Error();
            }
            totalHits = newTotalHits;
            gallery.innerHTML = '';
            options.params.page += 1; 

            hits.forEach(item => createMarkup(item));
            
            if (options.params.page * options.params.per_page >= totalHits) {
                showElement(loadBtn, false);
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            } else {
                showElement(loadBtn, true);
            }
        })
        .catch(() => Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again."));
}


function createMarkup(params) {
    const {webformatURL, largeImageURL, tags, likes, views, comments, downloads } = params;
    const markup = `
    <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
    </div>
    </div>`
    gallery.insertAdjacentHTML('beforeend', markup);
    showElement(loadBtn, true)
}