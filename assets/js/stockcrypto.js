// polygon.io
// ?? can't get the sort and queryCount to work - it still returns 10k results. Tried: &sort=desc&limit=20
API_KEY = '92bKvhEWQYOkEYm66Zp3bDSWLJJY5C5q';
// note: API doesn't work after 12am, moment sets the new day -1.5 days works.
let yesterday = moment().subtract(1.5, 'days').format('YYYY-MM-DD');
console.log(yesterday);
let today = moment().format('YYYY-MM-DD');
let ticker;
let stockQuery = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${yesterday}?adjusted=true&apiKey=${API_KEY}`;
let tickerCoder = `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&primary_exchange=${ticker}&apiKey=${API_KEY}`;

$.ajax({
  url: stockQuery,
  method: 'GET',
})
  .then(function (resp) {
    // TODO: sort resp before query
    let results = resp.results;

    let popularStock = results.sort(function (a, b) {
      return b.v - a.v;
    });
    popularStock = popularStock.slice(0, 20);

    // console.log(popularStock);

    for (let i = 0; i < popularStock.length; i++) {
      // The exchange symbol that this item is traded under.
      let ticker = popularStock[i].T;
      let open = popularStock[i].o;
      let close = popularStock[i].c;
      // let high = popularStock[i].h;
      // let low = popularStock[i].l;
      //The number of transactions in the aggregate window.
      // let transactionsNumber = popularStock[i].n;
      // The trading volume of the symbol in the given time period.
      // let tradingVolume = popularStock[i].v;
      // The volume weighted average price.
      let volumeAverage = popularStock[i].vw;
      let difference = (close - open).toFixed(2);
      let differencePercent = ((difference / volumeAverage) * 100).toFixed(2);

      // $.ajax({
      //   url: tickerCoder,
      //   method: 'GET'
      // }).then(function(resp) {
      //   console.log(resp);
      // })

      $('.stock-wrapper').append(
        `<div class="swiper-slide" role="group">
          <div class="stock-item p-5">
            <div class="d-flex flex-row justify-content-between">
              <h5>${ticker}</h5>
              <span
                ><i
                  class="fa-solid fa-arrow-trend-${
                    difference >= 0 ? 'up' : 'down'
                  } fa-2x"
                  aria-hidden="true"
                  title="Trend ${difference >= 0 ? 'up' : 'down'}"></i
              ></span>
            </div>
            <div class="d-flex flex-row justify-content-between">
              <div class="price me-2">
                <span class="fw-bold">${volumeAverage}</span>
              </div>
              <div class="difference d-flex flex-nowrap">
                <span class="difference-value ${
                  difference >= 0 ? 'high' : 'low'
                }">${difference}</span>
                <span class="difference-percent ${
                  difference >= 0 ? 'high' : 'low'
                }">(${differencePercent}%)</span>
              </div>
            </div>
          </div>
        </div>`
      );
    }
  })
  .catch((err) => console.log(err));

let crypto = 'BTC';
let currency = 'USD';
// let cryptoQuery = `https://api.polygon.io/v2/aggs/grouped/locale/global/market/crypto/${yesterday}?adjusted=true&apiKey=${API_KEY_STOCKS}`;
let cryptoQuery = `https://api.polygon.io/v1/open-close/crypto/${crypto}/${currency}/${today}?adjusted=true&apiKey=${API_KEY_STOCKS}`;

// $.ajax({
//   url: cryptoQuery,
//   method: 'GET',
// })
//   .then(function (resp) {
//     // console.log(resp);
//   })
//   .catch((err) => console.log(err));
