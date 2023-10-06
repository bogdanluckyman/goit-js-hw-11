import { gallery, showElement, loadBtn } from "./index";

export function createMarkup(params) {
    const { webformatURL,largeImageURL, tags, likes, views, comments, downloads } = params;
    const markup = `
    <div class="photo-card ">
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
    showElement(loadBtn, true);
}
