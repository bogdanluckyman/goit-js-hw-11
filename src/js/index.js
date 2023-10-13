import Notiflix from "notiflix";
import { fetchImage } from "./fetch";
import { createMarkup } from "./markup";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250
});

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const URL = 'https://pixabay.com/api/';
const KEY = '39849634-51b0690041743f79df8d2c395';
const options = {
    params: {
        key: KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: 1,
        per_page: 40
    }
};
let totalHits = 0;
let totalPages = 1;

loadBtn.addEventListener('click', loadMore);

function loadMore() {
    const { searchQuery } = form.elements;

    if (options.params.page > totalPages) {
        showElement(loadBtn, false);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        return;
    }

    fetchImage(searchQuery.value)
        .then(obj => {
            const { hits } = obj.data;
            
            if (options.params.page === totalPages) {
                hits.forEach(item => createMarkup(item));
                showElement(loadBtn, false);
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            } else {
                hits.forEach(item => {
            createMarkup(item)
            lightbox.refresh()
            });
                options.params.page += 1;
            }
        })
        .catch(error => {
            console.error(error);
            Notiflix.Notify.failure("An error occurred while loading more images.");
        });
}

function showElement(element, show) {
    element.hidden = !show;
}

form.addEventListener('submit', searchPhoto);

function searchPhoto(evt) {
    evt.preventDefault();
    const { searchQuery } = evt.currentTarget.elements;
    options.params.page = 1;

    const searchValue = searchQuery.value.trim(); 

    if (searchValue === '') {
        Notiflix.Notify.info("Please enter a search query.");
        return;
    }

    fetchImage(searchValue)
    .then(obj => {
        const { hits, totalHits: newTotalHits } = obj.data;
        if (hits.length === 0) {
            throw new Error("No results found for your search query. Please try again.");
        }
 
        totalPages = Math.ceil(newTotalHits / options.params.per_page);

        totalHits = newTotalHits;
        gallery.innerHTML = '';
        hits.forEach(item => {
            createMarkup(item)
            lightbox.refresh()
        });
        

        if (totalPages <= 1) {
            showElement(loadBtn, false);
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            options.params.page += 1;
            showElement(loadBtn, true);
        }
    })
    .catch(() => {
        gallery.innerHTML = '';
        showElement(loadBtn, false);
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    });
}

export { gallery, showElement, loadBtn, URL, options };