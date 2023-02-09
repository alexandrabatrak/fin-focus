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
      let largeThumnail = article.multimedia[0].url;
      let thumbnail = article.multimedia[1].url;
      // articleThumbnailAlt = articleThumbnail.caption;
      let category = article.section;
      let subcategory = article.subsection; // not all articles have
      let title = article.title;
      let articleURL = article.short_url;
      let abstract = article.abstract;
      let tags = article.des_facet; // array
      let geo = article.geo_facet; // not all of them have
      let byline = article.byline;
      let publishedDate = moment(article.published_date).format('LLL');
      let updatedDate = moment(article.updated_date).format('LLL');

      $articleElement.find('.thumbnail').append(`
        <img src="${
          $articleElement.hasClass('featured') ? largeThumnail : thumbnail
        }"
            alt="${thumbnail.caption}"
            style="object-fit:cover;width:100%;height:100%" />
      `);
      $articleElement.find('.badge').text(`${category}`);
      $articleElement.find('.article-title').append(`<h3>${title}</h3>`);
      $articleElement.find('.article-abstract').append(`<p>${abstract}</p>`);
      $articleElement.find('.by-line').text(`${byline}`);
      $articleElement
        .find('.last-updated')
        .append(`<span>Last updated</span> ${updatedDate}`);
    }
  })
  .catch((err) => console.log(err));

// TODO: display full list of top news on the aside bar

// this is a query for search
// use archives maybe
let sections = [
  '"Business Day"',
  '"Business"',
  '"Enterpreneurs"',
  '"Financial"',
  '"Your money"',
];
let searchArticles = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=news_desk:("Business Day", "Business", "Entrepreneurs", "Financial", "Your Money")&api-key=${API_KEY_NT}`;

// $.ajax({
//   url: searchArticles,
//   method: 'GET',
// })
//   .then(function (resp) {
//     // console.log(resp);
//     // filter results by business only
//   })
//   .catch((err) => console.log(err));

// polygon.io
API_KEY_STOCKS = '92bKvhEWQYOkEYm66Zp3bDSWLJJY5C5q';
// TODO: get the array of stock names
let stockName = 'AAPL';
let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
let today = moment().format('YYYY-MM-DD');
let stockQuery = `https://api.polygon.io/v2/aggs/ticker/${stockName}/range/1/day/${yesterday}/${today}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY_STOCKS}`;

// $.ajax({
//   url: stockQuery,
//   method: 'GET',
// })
//   .then(function (resp) {
//     // console.log(resp);
//   })
//   .catch((err) => console.log(err));

let crypto = 'BTC';
let currency = 'USD';
let cryptoQuery = `https://api.polygon.io/v1/open-close/crypto/${crypto}/${currency}/${today}?adjusted=true&apiKey=${API_KEY_STOCKS}`;

// $.ajax({
//   url: cryptoQuery,
//   method: 'GET',
// })
//   .then(function (resp) {
//     // console.log(resp);
//   })
//   .catch((err) => console.log(err));
