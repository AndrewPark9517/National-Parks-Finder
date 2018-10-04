const apiKey = "qYAKUXsbjrxq8TR6JPtgR3kt942CEvxHQP6Ykzf3";

//Function to turn parameters and base API into URL for Fetch
function getQueryString(params){
  const statesItems = [];
  for(let i = 0;i < params.stateCode.length;i++) {
    statesItems.push(`stateCode=${params.stateCode[i]}`)
  } 
  delete params.stateCode;
  const queryItems = Object.keys(params).map(key => {
    return `${key}=${params[key]}`;
    //needs to be params[key] not params.key since a key property
    //actually exists within params object
  });

  return statesItems.concat(queryItems).join('&');
}

//display parks from API response
function displayParks(responseJson) {
  $('#js-results-list').empty();

  //test code for pulling address from google geocode api, needs to be within the for loop below
  /*$('#js-results-list').empty();
  for(let i=0;i<responseJson.data.length;i++) {
    const parkAddress = fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIcomponent(responseJson.data[i].fullName)}&key=${apiKey}`)
    .then(reponse => response.json())
    .then(responseJson => return responseJson.results.formatted_address);*/

  for(let i=0;i<responseJson.data.length;i++) {
    $('#js-results-list').append(`
    <li><h4>${responseJson.data[i].fullName}</h4>
    <p>${responseJson.data[i].description}</p>
    <p><a target = '_blank' href = ${responseJson.data[i].url}>${responseJson.data[i].url}</a></p>
    </li>`)
  }
}

//Function to call the API
function getParks(states, maxParks) {
  let baseURL ="https://api.nps.gov/api/v1/parks";
  const params = {
    stateCode: states,
    limit: maxParks,
    key: apiKey
  }
  
  const queryString = getQueryString(params);

  const url = baseURL + '?' + queryString; 
  
  fetch(url).then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
    })
    .then(responseJson => displayParks(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}

function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault(); 
    const states = $('#states').val();
    const maxParks = $('#maxParks').val();
    getParks(states, maxParks);
  })
}

$(watchForm);