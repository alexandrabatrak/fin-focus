// polygon.io
// ?? can't get the sort and queryCount to work - it still returns 10k results. Tried: &sort=desc&limit=20
const API_KEY_STOCKS = '92bKvhEWQYOkEYm66Zp3bDSWLJJY5C5q';
// note: API retrieve's yesterday's closing date Monday-Friday
// 0 is sunday, 6 is saturday
// to gather any data for stocks 1.5 interval works better, but I don't always want to do .5 interval
// if time less than 8, do .5, otherwise normal

// let date =
//   moment().day() === 0 || moment().day() === 6
//     ? moment().format('YYYY-MM-DD')
//     : moment().day() === 1
//     ? moment()
//         .day(moment().hour() >= 0 && moment().hour() < 8 ? -3 : 3)
//         .format('YYYY-MM-DD')
//     : moment()
//         .day(
//           moment().hour() >= 0 && moment().hour() < 8
//             ? moment().day() === 0
//               ? -2
//               : -1
//             : moment().day() === 0
//             ? 2
//             : 1
//         )
//         .format('YYYY-MM-DD');

let date = moment().format('YYYY-MM-DD');

if (moment().day() === 1) {
  if (moment().hour() >= 0 && moment().hour() < 8) {
    date = moment().subtract(3.5, 'days').format('YYYY-MM-DD');
  } else {
    date = moment().subtract(3, 'days').format('YYYY-MM-DD');
  }
} else if (moment().day() === 0 || moment().day() === 6) {
  date = moment().format('YYYY-MM-DD');
} else {
  if (moment().hour() >= 0 && moment().hour() < 8) {
    date = moment().subtract(1.5, 'days').format('YYYY-MM-DD');
  } else {
    date = moment().subtract(1, 'days').format('YYYY-MM-DD');
  }
}
// let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
let ticker;
let stockQuery = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true&apiKey=${API_KEY_STOCKS}`;
// let tickerCoder = `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&primary_exchange=${ticker}&apiKey=${API_KEY_STOCKS}`;
// let ticketInfo = `https://api.polygon.io/v3/reference/tickers/AAPL?apiKey=${API_KEY_STOCKS}`;

$.ajax({
  url: stockQuery,
  method: 'GET',
})
  .then(function (resp) {
    let results = resp.results;
    // sort by top trading volume
    let popularStock = results.sort(function (a, b) {
      return b.v - a.v;
    });
    popularStock = popularStock.slice(0, 20);

    console.log(popularStock);

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
      let difference = close - open;
      // don't know how to best calculate this shit
      let differencePercent = (difference / open) * 100;

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
              <p>${ticker}</p>
              <span
                ><i
                  class="fa-solid fa-arrow-trend-${
                    difference >= 0 ? 'up' : 'down'
                  }"
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
                } pe-1">${difference.toFixed(2)}</span>
                <span class="difference-percent ${
                  difference >= 0 ? 'high' : 'low'
                }">(${differencePercent.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </div>`
      );
    }
  })
  .catch((err) => console.log(err));

let cryptoQuery = `https://api.polygon.io/v2/aggs/grouped/locale/global/market/crypto/${date}?adjusted=true&apiKey=${API_KEY_STOCKS}`;

// let exchanges = `https://api.polygon.io/v3/reference/exchanges?asset_class=crypto&locale=global&apiKey=${API_KEY_STOCKS}`

$.ajax({
  url: cryptoQuery,
  method: 'GET',
})
  .then(function (resp) {
    let results = resp.results;
    let topCrypto = results.sort(function (a, b) {
      return b.v - a.v;
    });
    topCrypto = topCrypto.slice(0, 20);
    for (let i = 0; i < topCrypto.length; i++) {
      let ticker = topCrypto[i].T.replace('X:', '').replace('USD', '/USD');
      let open = topCrypto[i].o;
      let close = topCrypto[i].c;
      // let high = topCrypto[i].h;
      // let low = topCrypto[i].l;
      //The number of transactions in the aggregate window.
      let transactionsNumber = topCrypto[i].n;
      // The trading volume of the symbol in the given time period.
      // The volume weighted average price.
      let volumeAverage = topCrypto[i].vw;
      let difference = close - open;
      let differencePercent = (difference / open) * 100;

      $('#top-crypto .crypto-wrapper').append(
        `<div class="swiper-slide" role="group">
          <div class="crypto-item px-5 py-3">
              <div class="d-flex flex-row justify-content-between">
                <p>${ticker}</p>
                <span
                  ><i
                    class="fa-solid fa-arrow-trend-${
                      difference >= 0 ? 'up' : 'down'
                    }"
                    aria-hidden="true"
                    title="Trend ${difference >= 0 ? 'up' : 'down'}"></i
                ></span>
              </div>
              <div class="d-flex flex-column">
                <div class="price me-2">
                  <span class="fw-bold">${close}</span>
                </div>
                <div class="difference d-flex flex-row">
                  <span class="difference-value ${
                    difference >= 0 ? 'high' : 'low'
                  } pe-1">${difference.toFixed(6)}</span>
                  <span class="difference-percent ${
                    difference >= 0 ? 'high' : 'low'
                  }">(${differencePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>`
      );
    }
  })
  .catch((err) => console.log(err));

// show when market is open
let openMarket = `https://api.polygon.io/v1/marketstatus/now?apiKey=${API_KEY_STOCKS}`;

$.ajax({
  url: openMarket,
  method: 'GET',
})
  .then(function (resp) {
    console.log(resp);
    let market = resp.market;
    let exchanges = resp.exchanges;
    console.log(exchanges);
    let marketplace;

    $('.open-market').append(
      `<div class="pb-3 d-flex flex-row flex-lg-column">
        <div class="market me-3">
          <span class="me-1 fw-bold">Market: </span>
          <span class="text-uppercase fw-bold ${
            market.includes('open') ? 'open' : 'closed'
          }">${market}</span>
        </div>
        <div class="marketplaces d-flex flex-row flex-lg-column"></div>
      </div>`
    );

    for (let [exchange, status] of Object.entries(exchanges)) {
      marketplace = $(
        `<div class="me-1 mb-0"><span class="text-uppercase">${exchange}: </span><span class="text-uppercase me-2 mb-0 fw-bold">${status}</span></div>`
      );
      $('.marketplaces').append(marketplace);
    }
  })
  .catch((err) => console.log(err));
