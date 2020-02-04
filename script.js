const inputs = document.querySelectorAll("input");
let myCountryObject;
let myCountryArray;
const countryOverview = document.querySelector(".overviewWrapper");

function initalCoutryCall(){
  const url = "https://restcountries.eu/rest/v2/all"
  fetch(url)
    .then(response => response.json())
    .then(data => {
      myCountryObject = data.reduce((currentList, country) => {
        return {...currentList, [country.alpha3Code]: country}
      }, {});
      myCountryArray = data;
      getCountries();
  });
}

function getCountries(){
  document.querySelector(".gridWrapper").innerHTML = '';
  const search = input.value;
  const filter = document.querySelector("select").value;
  
  myCountryArray.forEach(country => {
    let filter = document.querySelector("select").value;
    let regex = new RegExp(search, "gi");
    let regexFilter = new RegExp(filter, "gi");
    if(country.name.match(regex) || country.capital.match(regex) || search == ''){
      if(country.region.match(regexFilter) || country.subregion.match(regexFilter) || filter == ''){
          let newDiv = document.createElement('div');
          newDiv.classList = "countryBox";
          newDiv.dataset.country = country.alpha2Code;
          newDiv.innerHTML = createCountryElement(country);
          newDiv.addEventListener('click', showCountryOverview);
          document.querySelector(".gridWrapper").append(newDiv);
        }
      }
    });
}

function createCountryElement(country){
  return (`
      <div class="imgWrapper" style="background-image:url(${country.flag})">
      </div>
      <div class="infoWrapper">
        <div class="h1">${country.name}</div>
        <div class="population infoItem">
          <span class="text-bold">Population:</span><span> ${parseInt(country.population).toLocaleString()}</span>
        </div>
        <div class="region infoItem">
          <span class="text-bold">Region:</span><span> ${country.region}</span>
        </div>
        <div class="capital infoItem">
          <span class="text-bold">Capital:</span><span> ${country.capital}</span>
        </div>
      </div>
`);
}

function showCountryOverview(){
  const countryCode = this.dataset.country;
  const url = "https://restcountries.eu/rest/v2/alpha/" + countryCode;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      
    countryOverview.querySelector(".flagImg").src = data.flag;
    countryOverview.querySelector(".h1").innerHTML = data.name;
    countryOverview.querySelector(".nativename").innerHTML = data.nativeName;
    countryOverview.querySelector(".population").innerHTML = parseInt(data.population).toLocaleString();
    countryOverview.querySelector(".region").innerHTML = data.region;
    countryOverview.querySelector(".subregion").innerHTML = data.subregion;
    countryOverview.querySelector(".capital").innerHTML = data.capital;
    
    countryOverview.querySelector(".topLevelDomain").innerHTML = data.topLevelDomain.join(', ');
    countryOverview.querySelector(".currencies").innerHTML = data.currencies.map(curr => curr.name).join(', ');
    countryOverview.querySelector(".languages").innerHTML = data.languages.map(lang => lang.name).join(', ');
    countryOverview.querySelector(".borders").innerHTML = data.borders.length ? data.borders.map(borderCode => "<span data-country=" + borderCode + ">" + myCountryObject[borderCode].name + "</span>").join('') : "no borders";
    
    countryOverview.querySelectorAll(".borders span").forEach(span => span.addEventListener('click', showCountryOverview));

    countryOverview.classList.add("active");
   window.scrollTo({ top: 60, behavior: 'smooth' });
  });
}

initalCoutryCall();

let timeout;
inputs.forEach(input => input.addEventListener('keyup', () => {
    clearTimeout(timeout);
    timeout = setTimeout(getCountries, 500);
}));

document.querySelector(".btn-close").addEventListener('click', () => {
  countryOverview.classList.remove('active');
});

document.querySelector("#displayMode").addEventListener('click', () =>{
  console.log("click");
  document.querySelector("body").classList.toggle('darkMode');
});

document.querySelector("select").addEventListener('change', getCountries);