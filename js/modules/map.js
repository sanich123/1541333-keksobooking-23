import { disableFunction, enableFunction } from './util.js';
import { newOffers, PHOTOS, FEATURES } from './data.js';

disableFunction();

const resetButton = document.querySelector('.ad-form__reset');
const inputAddress = document.querySelector('#address');

const templateOffer = document.querySelector('#card').content;
const popupArticle = templateOffer.querySelector('.popup');

const similarOfferFragment = document.createDocumentFragment();

//Создаем карту
const map = L
  .map('map-canvas')
  .on('load', () => {
    enableFunction();
  })
  .setView({lat: 35.68950,
    lng: 139.69171}, 16);
//Добавляем слой с изображениями
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

//Создаем большую иконку
const bigCustomIcon = L.icon({
  iconUrl: './leaflet/images/marker-icon-2x.png',
  iconSize: [50, 82],
  iconAnchor: [25, 82],
});

//Создаем большую метку
const bigMarker = L.marker(
  { lat: 35.68950, lng: 139.69171 },
  { draggable:true, icon: bigCustomIcon },
).addTo(map);

//Обработчик перемещения большой метки
bigMarker.on('moveend', (evt) => {
  const latLng = evt.target.getLatLng();
  inputAddress.value = `lat: ${latLng.lat.toFixed(5) }, lng: ${  latLng.lng.toFixed(5)}`;
});

// bigMarker.remove();

newOffers.forEach((newOffer) => {
  const realOffer = popupArticle.cloneNode(true);
  realOffer.querySelector('.popup__title').textContent = newOffer.offer.title;
  realOffer.querySelector('.popup__text--address').textContent = `${newOffer.offer.address.lat   },${  newOffer.offer.address.lng}`;
  realOffer.querySelector('.popup__text--price').textContent = `${newOffer.offer.price  } ₽/ночь`;
  realOffer.querySelector('.popup__type').textContent = newOffer.offer.type;
  switch (newOffer.offer.type) {
    case 'flat' : realOffer.querySelector('.popup__type').textContent = 'Квартира'; break;
    case 'bungalow' : realOffer.querySelector('.popup__type').textContent = 'Бунгало'; break;
    case 'house' : realOffer.querySelector('.popup__type').textContent = 'Дом'; break;
    case 'palace' : realOffer.querySelector('.popup__type').textContent = 'Дворец'; break;
    case 'hotel' : realOffer.querySelector('.popup__type').textContent = 'Отель'; break;
  }
  realOffer.querySelector('.popup__text--capacity').textContent = `${newOffer.offer.rooms}   комнаты для ${newOffer.offer.guests} гостей`;
  // eslint-disable-next-line no-useless-concat
  realOffer.querySelector('.popup__text--time').textContent = `Заезд после ${  newOffer.offer.checkin  },` +  ` выезд до ${  newOffer.offer.checkout}`;
  const features = realOffer.querySelector('.popup__features');
  features.innerHTML = '';

  FEATURES.forEach((currentValue) => {
    const feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add(`popup__feature--${currentValue}`);
    features.appendChild(feature);
  });

  realOffer.querySelector('.popup__description').textContent = newOffer.offer.description;
  const photos = realOffer.querySelector('.popup__photos');
  photos.innerHTML = '';

  PHOTOS.forEach((currentValue) => {
    const photo = document.createElement('img');
    photo.classList.add('popup__photo');
    photo.src = currentValue;
    photo.width = 45;
    photo.height = 40;
    photo.alt = 'Фотография жилья';
    photos.appendChild(photo);
  });
  realOffer.querySelector('.popup__avatar').src = newOffer.author.avatar;
  for (let index = 0; index < popupArticle.length; index++) {
    if (popupArticle.children[index].textContent === '')  {
      popupArticle.children[index].style.display = 'none';
    }
  }
  const customIcon = L.icon({
    iconUrl: './leaflet/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  const marker = L.marker(
    {
      lat: newOffer.location.lat,
      lng: newOffer.location.lng,
    },
    {
      customIcon,
    },
  );
  marker.addTo(map)
    .bindPopup(similarOfferFragment.appendChild(realOffer));
});

resetButton.addEventListener('click', () => {
  bigMarker.setLatLng({
    lat: 35.68950, lng: 139.69171,
  });

  map.setView({
    lat: 35.68950, lng: 139.69171,
  }, 16);
});