import Notiflix from "notiflix";
import { fetchImage } from "./fetch";
import { createMarkup } from "./markup";

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

    if (options.params.page >= totalPages) {
        showElement(loadBtn, false);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        return;
    }

    fetchImage(searchQuery.value)
        .then(obj => {
            const { hits } = obj.data;
            hits.forEach(item => createMarkup(item));
            options.params.page += 1;
        })
        .catch(error => {
            console.error(error);
            Notiflix.Notify.failure("An error occurred while loading more images.");
        });
}

function showElement(element, show) {
    if (show) {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
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
        if (totalPages <= 1) { // Додайте перевірку на одну сторінку
            showElement(loadBtn, false);
        } else {
            options.params.page += 1;
            showElement(loadBtn, true);
        }

        totalHits = newTotalHits;
        gallery.innerHTML = '';
        hits.forEach(item => createMarkup(item));
    })
        .catch(() => {
            gallery.innerHTML = '';
            showElement(loadBtn, false);
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        });
}

export { gallery, showElement, loadBtn, URL, options };