import {createMarker} from './map.js';
import {  showAlert } from './util.js';
import { getData } from './fetch.js';
import { markerGroup } from './map.js';
import { debounce } from '../utils/debounce.js';

const RERENDER_DELAY = 500;
const NUMBER_FOR_SLICING = 10;

const blockFilter = document.querySelector('.map__filters');
const filterType = blockFilter.querySelector('#housing-type');
const filterPrice = blockFilter.querySelector('#housing-price');
const filterRooms = blockFilter.querySelector('#housing-rooms');
const filterGuests = blockFilter.querySelector('#housing-guests');
const filterFeatures = blockFilter.querySelector('#housing-features');

const renderSimilarOffers = (arr) => {
  markerGroup.clearLayers();
  arr
    .slice(0, NUMBER_FOR_SLICING)
    .forEach((currentValue) => {
      createMarker(currentValue);
    });
};

const allOffers =
getData(
  ('https://23.javascript.pages.academy/keksobooking/data'),
  (offer) => {
    renderSimilarOffers(offer);
    const filter = () => {
      let arr = offer.slice();
      const filtersFunctions = [
        // filtersType(arr),
        () => {
          const value = filterType.value;
          arr = arr.filter((it) => value === 'any' ? it : it.offer.type === value);
        },
        () => {
          const value = filterPrice.value;
          arr = arr.filter((it) => {
            if (value === 'middle' && it.offer.price >= 10000 && it.offer.price <= 50000) {
              return it;
            } else if (value === 'low' && it.offer.price < 10000) {
              return it;
            } else if (value === 'high' && it.offer.price > 50000) {
              return it;
            } else if (value === 'any') {
              return it;
            }
          });
        },
        () => {
          const value = filterRooms.value;
          arr = arr.filter((it) => {
            if (value === '1' && it.offer.rooms === 1) {
              return it;
            } else if (value === '2' && it.offer.rooms === 2) {
              return it;
            } else if (value === '3' && it.offer.rooms === 3) {
              return it;
            } else if (value === 'any') {
              return it;
            }
          });
        },
        () => {
          const value = filterGuests.value;
          arr = arr.filter((it) => {
            if (value === '1' && it.offer.guests === 1) {
              return it;
            } else if (value === '2' && it.offer.guests === 2) {
              return it;
            } else if (value === '0' && it.offer.guests > 99) {
              return it;
            } else if (value === 'any') {
              return it;
            }
          });
        },
        () => {
          const checkboxActive = document.querySelectorAll('[name="features"]:checked');
          arr = arr.filter((it) => Array.from(checkboxActive).every(({ value }) => it.offer.features && it.offer.features.includes(value)));
        },
      ];
      filtersFunctions.forEach((fn) => {
        fn();
      });
      renderSimilarOffers(arr);
    };
    filterPrice.addEventListener('change', debounce(() => {
      filter();
    }, RERENDER_DELAY));
    filterType.addEventListener('change', debounce(() => {
      filter();
    }, RERENDER_DELAY));
    filterRooms.addEventListener('change', debounce(() => {
      filter();
    }, RERENDER_DELAY));
    filterGuests.addEventListener('change', debounce(() => {
      filter();
    }, RERENDER_DELAY));
    filterFeatures.addEventListener('change', debounce(() => {
      filter();
    }, RERENDER_DELAY));
  },
  (error) => {
    showAlert(`Данные с сервера не загружены. ${error}`);
  },
);
allOffers();

export
{allOffers};
