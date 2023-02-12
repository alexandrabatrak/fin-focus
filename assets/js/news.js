const API_KEY_NT = 'FwLzNfy2zMccC5ApnWI1jbUfKos1SA1n';
let section, articles;
const sections = ['business', 'technology', 'politics', 'world'];

sections.forEach((section) => {
  if ($(`.top-section[data-section="${section}"]`).length) {
    renderTopArtcilesSections(section);
  }
});

function renderTopArtcilesSections(section) {
  console.log(section);
  let ny = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${API_KEY_NT}`;

  $.ajax({
    url: ny,
    method: 'GET',
  })
    .then(function (resp) {
      let results = resp.results;
      console.log(results);

      // then add to the rest
      const articles = $(`.top-section[data-section="${section}"] article`);
      const featuredArticle = results[0];

      updateArticleContent(featuredArticle, $(articles[0]));

      for (let i = 1; i < articles.length; i++) {
        let article = results[i];
        updateArticleContent(article, $(articles[i]));
      }

      function updateArticleContent(article, $articleElement) {
        let largeThumnail = article.multimedia[0];
        let thumbnail = article.multimedia[1];
        let category = article.section;
        let subcategory = article.subsection; // not all articles have
        let title = article.title;
        let articleURL = article.url;
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
        ).append(`<a class="stretched-link" href="${articleURL} target="_blank"><h3>
      ${title}</h3></a>`);
        $articleElement.find('.article-abstract').append(`<p>${abstract}</p>`);
        $articleElement.find('.by-line').text(`${byline}`);
        $articleElement
          .find('.last-updated')
          .append(`<span>Published on</span> ${publishedDate}`);
      }
    })
    .catch((err) => console.log(err));
}
// TODO: display full list of top news on the aside bar

// query for search and tabs
// !! keywords return weird set of articles. Check exact keywords

// TODO: Better UI - Add accordeon options so only few articles are shown in the group - generally the design isn't the best as it is
let categoryNews = $('.category-news-articles-wrapper');
let keywords = $('.category-news .nav').find('.category-tab').data('category');
let newsDesk = [
  'Business',
  'Your Money',
  'Entrepreneurs',
  'Finance',
  'Business day',
  'SundayBusiness',
];
searchNews(keywords);
$('.category-news').on('click', '.nav-item button', function () {
  keywords = $(this).attr('data-category');
  categoryNews.empty();
  searchNews(keywords);
});

function searchNews(keywords) {
  let startDate = moment('2019').format('YYYYMMDD');
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
          `<div class="pe-3 mb-5">
          <article class="w-100">
            <div class="article-content d-flex flex-column flex-md-row">
              <div class="thumbnail col-sm-12 col-md-4 me-3 position-relative">
                <div class="thumbnail-bg" style="background-image: url(${thumbnail})"></div>
                <div
                  class="badge category mt-0 rounded-0 text-white text-uppercase text-right position-absolute bottom-0 end-0">
                  ${category}</div>
              </div>
              <div class="article-details col-sm-12 col-md-8">
                <div class="article-title mb-3">
                  <h3 class="pb-3">${title}</h3>
                  <div class="by-line">${byline}</div>
                  <div class="published"><span>Published on </span>${publishedDate}</div>
                </div>
                <div class="article-abstract mb-3">
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
// let thumbnailHeight = function () {
//   $('.thumbnail-bg').each(function () {
//     if (window.matchMedia('(min-width: 768px)').matches) {
//       $(this).css({
//         height: `${$(this).closest('article').outerHeight(true)}px`,
//       });
//     } else {
//       $(this).css({ height: '100px' });
//     }
//   });
// };
