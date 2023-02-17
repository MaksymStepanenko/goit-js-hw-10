import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';



const DEBOUNCE_DELAY = 300;

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(res => 
  {
      if (!res.ok)
      {
    throw new Error('Oops, there is no country with that name.');
  }
  return res.json()});
}

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce( onInput , DEBOUNCE_DELAY)
);

function onInput(e) {
  let name = '';
  name = e.target.value.trim();
  if (name.length === 0) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
  }

  fetchCountries(name)
    .then(countingTheNumberCountries)
    .catch(showFetchError);
}

function countingTheNumberCountries(data) {
  if (data.length === 1) {
    renderFetchCountries(data);
  } else if (data.length > 1 && data.length < 10) {
    renderCountriesList(data);
  } else if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else {
    Notify.failure('Oops, there is no country with that name');
  }
}

function renderFetchCountries(data) {
  refs.countryList.innerHTML = '';

  const [{ capital, flags, name, languages, population }] = data;

  const murkup = `<div>
        <img src="${flags.svg}" alt="${flags.alt}" width="50">
        <p>${name.official}</p>
      </div>
      
      <p><b>Capital</b>: ${capital.join('')}</p>
      <p><b>Population</b>: ${population}</p>
      <p><b>Languages</b>: ${Object.values(languages).join(', ')}</p>
    </div>`;
  refs.countryInfo.innerHTML = murkup;
}

function renderCountriesList(data) {
  refs.countryInfo.innerHTML = '';

  const murkup = data
    .map(el => {
      const { flags, name } = el;
      return `<li>
        <img src="${flags.svg}" alt="${flags.alt}" width="50">
        <p>${name.official}</p>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = murkup;
}

function showFetchError(message) {
  Notiflix.Notify.failure(`${message}`);
}
