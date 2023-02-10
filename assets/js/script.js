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
      let publishedDate = moment(article.published_date).format('LLL');
      let updatedDate = moment(article.updated_date).format('LLL');

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
        .append(`<span>Last updated</span> ${updatedDate}`);
    }
  })
  .catch((err) => console.log(err));

// TODO: display full list of top news on the aside bar

// query for search and tabs
// ??: either populate on load, or when user selects the tab
let categoryNews = $('.category-news-articles-wrapper .row');
let keywords = $('.category-news .nav').find('.category-tab').data('category');
searchNews(keywords);
$('.category-news').on('click', '.nav-item button', function () {
  keywords = $(this).attr('data-category');
  categoryNews.empty();
  searchNews(keywords);
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
        let thumbnail = results[i].multimedia[21];
        let category = results[i].section_name;
        let subcategory = results[i].subsection; // not all articles have
        let title = results[i].headline.main;
        let articleURL = results[i].web_url;
        let abstract = results[i].abstract;
        let leadParagraph = results[i].lead_paragraph;
        let tags = results[i].keywords; // array
        let byline = results[i].byline.original;
        let publishedDate = moment(results[i].pub_date).format('LLL');
        categoryNews = $('.category-news-articles-wrapper').filter(function () {
          return $(this).data('category') === keywords;
        });
        categoryNews.append(
          `<div class="col-sm-12 col-md-6">
            <div class="thumbnail flex-shrink-1">
              <img src="https://www.nytimes.com/${thumbnail.url}" alt="${
            thumbnail.caption
          }">
            </div>
            <article class="d-flex">
              <div class="article-details w-100">
                <div class="badge category mt-0 p-3 rounded-0 text-white text-uppercase text-right position-relative bottom-0"></div>
                <div class="article-title">
                  <a href="${articleURL}" target="_blank">
                    <h3>${title}</h3>
                  </a>
                </div>
                <div class="article-abstract">
                  <p>${abstract}</p>
                </div>
                <div class="article-lead">
                  <p>${leadParagraph}...</p>
                </div>
                <div class="by-line">${byline}</div>
                <div class="published">
                  <span>Published on </span>${publishedDate}
                </div>
              </div>
              <div class="article-footer">
                <div class="subcategory">
                  ${subcategory ? subcategory : ''}
                </div>
              </div>
            </article>
          </div>`
        );
      }
    })
    .catch((err) => console.log(err));
}

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
