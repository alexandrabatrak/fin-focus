API_KEY_NT = 'FwLzNfy2zMccC5ApnWI1jbUfKos1SA1n';
let topStories = `https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${API_KEY_NT}`;

$.ajax({
  url: topStories,
  method: 'GET',
})
  .then(function (resp) {
    console.log(resp);
    // filter results by business only
  })
  .catch((err) => console.log(err));

// this is a query for search
let searchArticles = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=news_desk:("Business Day", "Business", "Entrepreneurs", "Financial", "Your Money")&api-key=${API_KEY_NT}`;

$.ajax({
  url: searchArticles,
  method: 'GET',
})
  .then(function (resp) {
    console.log(resp);
    // filter results by business only
  })
  .catch((err) => console.log(err));

// polygon.io
API_KEY_STOCKS = '92bKvhEWQYOkEYm66Zp3bDSWLJJY5C5q';
// TODO: get the array of stock names
let stockName = 'AAPL';
let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
let today = moment().format('YYYY-MM-DD');
let stockQuery = `https://api.polygon.io/v2/aggs/ticker/${stockName}/range/1/day/${yesterday}/${today}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY_STOCKS}`;

$.ajax({
  url: stockQuery,
  method: 'GET',
})
  .then(function (resp) {
    console.log(resp);
  })
  .catch((err) => console.log(err));

let crypto = 'BTC';
let currency = 'USD';
let cryptoQuery = `https://api.polygon.io/v1/open-close/crypto/${crypto}/${currency}/${today}?adjusted=true&apiKey=${API_KEY_STOCKS}`;

$.ajax({
  url: cryptoQuery,
  method: 'GET',
})
  .then(function (resp) {
    console.log(resp);
  })
  .catch((err) => console.log(err));
