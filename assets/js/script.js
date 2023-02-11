API_KEY_NT = 'FwLzNfy2zMccC5ApnWI1jbUfKos1SA1n';
let topStories = `https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${API_KEY_NT}`;

$.ajax({
  url: topStories,
  method: 'GET',
})
  .then(function (resp) {
    let results = resp.results;
    // filter results by business only
    let business = results.filter((results) => {
      return results.section.includes('business');
    });

    // then add to the rest
    const articles = $('.top-section article');
    const featuredArticle = business[0];

    updateArticleContent(featuredArticle, $(articles[0]));

    for (let i = 1; i < articles.length; i++) {
      let article = business[i];
      updateArticleContent(article, $(articles[i]));
    }
    function updateArticleContent(article, $articleElement) {
      // TODO: make a whole article link? or think of how to do it best
      let largeThumnail = article.multimedia[0];
      let thumbnail = article.multimedia[1];
      // articleThumbnailAlt = articleThumbnail.caption;
      let category = article.section;
      let subcategory = article.subsection; // not all articles have
      let title = article.title;
      let articleURL = article.short_url;
      let abstract = article.abstract;
      let tags = article.des_facet; // array
      let geo = article.geo_facet; // not all of them have
      let byline = article.byline;
      let publishedDate = moment(article.published_date).format('LL');
      let updatedDate = moment(article.updated_date).format('LL');

      $articleElement.find('.thumbnail').append(`
        <img src="${
          $articleElement.hasClass('featured')
            ? largeThumnail.url
            : thumbnail.url
        }" alt="${$articleElement.hasClass('featured') ? largeThumnail.caption : thumbnail.caption}"/>
      `);
      $articleElement.find('.badge').text(`${category}`);
      $articleElement.find(
        '.article-title'
      ).append(`<a href="${articleURL} target="_blank"><h3>
      ${title}</h3></a>`);
      $articleElement.find('.article-abstract').append(`<p>${abstract}</p>`);
      $articleElement.find('.by-line').text(`${byline}`);
      $articleElement
        .find('.last-updated')
        .append(`<span>Published on</span> ${publishedDate}`);
    }
  })
  .catch((err) => console.log(err));

// TODO: display full list of top news on the aside bar

// query for search and tabs
// !! keywords return weird set of articles. Check exact keywords
let categoryNews = $('.category-news-articles-wrapper');
let keywords = $('.category-news .nav').find('.category-tab').data('category');
// searchNews(keywords);
$('.category-news').on('click', '.nav-item button', function () {
  keywords = $(this).attr('data-category');
  categoryNews.empty();
  // searchNews(keywords);
});

function searchNews(keywords) {
  let startDate = moment('1980').format('YYYYMMDD');
  let endDate = moment().format('YYYYMMDD');
  let searchArticles = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&q=${keywords}&fq=news_desk:("Business", "Your Money", "Entrepreneurs", "Finance", "Business day", "SundayBusiness")&begin_date=${startDate}&end_date=${endDate}&sort=newest&api-key=${API_KEY_NT}`;

  $.ajax({
    url: searchArticles,
    method: 'GET',
  })
    .then(function (resp) {
      let results = resp.response.docs;

      for (let i = 0; i < results.length; i++) {
        let thumbnail = `'https://www.nytimes.com/${results[i].multimedia[22].url}'`;
        let category = results[i].section_name;
        let subcategory = results[i].subsection; // not all articles have
        let title = results[i].headline.main;
        let articleURL = results[i].web_url;
        let abstract = results[i].abstract;
        let leadParagraph = results[i].lead_paragraph;
        let tags = results[i].keywords; // array
        let byline = results[i].byline.original;
        let publishedDate = moment(results[i].pub_date).format('LL');
        categoryNews = $('.category-news-articles-wrapper').filter(function () {
          return $(this).data('category') === keywords;
        });
        categoryNews.find('.row').append(
          `<div class="col-xl-12 col-xxl-6 pe-3 mb-3">
          <article class="w-100">
            <div class="article-content">
              <div class="article-header d-flex mb-3">
                <div class="thumbnail me-3">
                  <div class="thumbnail-bg" style="background-image: url(${thumbnail})"></div>
                </div>
                <div class="article-title">
                    <div
                    class="badge category mt-0 rounded-0 text-white text-uppercase text-right position-relative bottom-0">
                    ${category}</div>
                    <h4 class="pt-3">${title}</h4>
                    <div class="by-line">${byline}</div>
                    <div class="published"><span>Published on </span>${publishedDate}</div>
                </div>
              </div>
              <div class="article-details d-flex flex-column justify-content-between">
                <div class="article-abstract">
                  <h5>${abstract}</h5>
                </div>
                <div class="article-lead">
                  <p>${leadParagraph}... <a href="${articleURL}" target="_blank"><span class="read-more">Read more</span></a></p>
                </div>
              </div>
            </div>
          </article>
        </div>`
        );
      }
      thumbnailHeight();
    })
    // TODO: add error render to html
    .catch((err) => console.log(err));
}

// height of the thumbnail
let thumbnailHeight = function () {
  $('.thumbnail-bg').each(function () {
    $(this).css({
      height: `${$(this).closest('.article-header').outerHeight(true)}px`,
    });
  });
};

// polygon.io
// ?? can't get the sort and queryCount to work - it still returns 10k results. Tried: &sort=desc&limit=20
API_KEY_STOCKS = '92bKvhEWQYOkEYm66Zp3bDSWLJJY5C5q';
// note: API doesn't work after 12am, moment sets the new day -1.5 days works.
let yesterday = moment().subtract(1.5, 'days').format('YYYY-MM-DD');
console.log(yesterday);
let today = moment().format('YYYY-MM-DD');
let ticker;
let stockQuery = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${yesterday}?adjusted=true&apiKey=${API_KEY_STOCKS}`;
let tickerCoder = `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&primary_exchange=${ticker}&apiKey=${API_KEY_STOCKS}`;

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
      console.log(difference);

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
                    difference > 0 ? 'up' : 'down'
                  } fa-2x"
                  aria-hidden="true"
                  title="Trend ${difference > 0 ? 'up' : 'down'}"></i
              ></span>
            </div>
            <div class="d-flex flex-row justify-content-between">
              <div class="price me-2">
                <span class="fw-bold">${volumeAverage}</span>
              </div>
              <div class="difference">
                <span class="difference-value ${
                  difference > 0 ? 'high' : 'low'
                }">${difference}</span>
                <span class="difference-percent ${
                  difference > 0 ? 'high' : 'low'
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

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  slidesPerView: 5,
  spaceBetween: 2,
  initialSlide: 1,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    350: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    540: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    1100: {
      slidesPerView: 5,
      spaceBetween: 0,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 0,
    },
  },
});
