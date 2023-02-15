const API_KEY_NT = 'FwLzNfy2zMccC5ApnWI1jbUfKos1SA1n';
let section, articles;
const sections = ['business', 'technology', 'politics', 'world'];

sections.forEach((section) => {
  if ($(`.top-section[data-section="${section}"]`).length) {
    articles = $(`.top-section[data-section="${section}"] article`);
    renderTopArtcilesSections(section, articles, true);
  }
});

function asideNewsRender() {
  articles = $('#aside-top-news article');
  section = 'business';
  renderTopArtcilesSections(section, articles, false);
}
asideNewsRender();

function renderTopArtcilesSections(section, articles, isMain) {
  let ny = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${API_KEY_NT}`;

  $.ajax({
    url: ny,
    method: 'GET',
  })
    .then(function (resp) {
      let results = resp.results;
      console.log(results);

      if (resp.status === 'OK') {
        if (isMain) {
          // skip empty articles
          // doesn't solve the issue if the [0] and [2] are empty.
          let startIndex = 0;
          while (startIndex < results.length && !results[startIndex].url) {
            startIndex++;
          }
          if (startIndex < results.length) {
            const featuredArticle = results[startIndex];
            updateArticleContent(featuredArticle, $(articles[0]));
            for (let i = 1; i < 3; i++) {
              let article = results[startIndex + i];
              if (!article || !article.url) {
                break;
              }
              updateArticleContent(article, $(articles[i]));
            }
          }
        } else {
          for (let i = 3; i < articles.length + 3; i++) {
            let article = results[i - 3];
            if (!article || !article.url) {
              break;
            }
            updateArticleContent(article, $(articles[i - 3]));
          }
        }

        function updateArticleContent(article, $articleElement) {
          let largeThumnail = article.multimedia[0];
          let thumbnail = article.multimedia[1];
          let category = article.section;
          let title = article.title;
          let articleURL = article.url;
          let abstract = article.abstract;
          let byline = article.byline;
          let publishedDate = moment(article.published_date).format('LL');

          $articleElement.find('.thumbnail').append(`
        <img src="${
          $articleElement.hasClass('featured')
            ? largeThumnail.url
            : thumbnail.url
        }" alt="${
            $articleElement.hasClass('featured')
              ? largeThumnail.caption
              : thumbnail.caption
          }"/>
      `);
          $articleElement.find('.badge').text(`${category}`);
          $articleElement.find('.article-title')
            .append(`<a class="stretched-link" href="${articleURL} target="_blank"><h3>
      ${title}</h3></a>`);
          $articleElement
            .find('.article-abstract')
            .append(`<p>${abstract}</p>`);
          $articleElement.find('.by-line').append(`<span>${byline}</span>`);
          $articleElement
            .find('.last-updated')
            .append(`<span>Published on</span> ${publishedDate}`);
        }
      }
    })
    .catch((err) => {
      showError($articleElement);
    });
}

// query for search and tabs
// TODO: Better UI - Add accordeon options so only few articles are shown in the group - generally the design isn't the best as it is
let keywords = $('.category-news .nav').find('.category-tab').data('category');
let categoryNews = $('.category-news-articles-wrapper');
let searchResults = $(
  `<section class="search-results category-news">
    <div class="heading-title pt-4 pb-2 mb-5">
      <h2>Search results for <span id="searchKeyword" class="fst-italic"></span></h2>
    </div>
    <div class="row"></div>
  </section>`
);

searchNews(keywords, categoryNews, false);
$('.category-news').on('click', '.nav-item button', function () {
  keywords = $(this).attr('data-category');
  searchNews(keywords, categoryNews, false);
});

$('form#search').on('submit', function (e) {
  e.preventDefault();
  let input = $('#search input');
  // prevent initialising search if input value is empty
  if (input.val() == '') {
    return;
  } else {
    keywords = $('#search input').val();
    searchResults.find('#searchKeyword').text(keywords);
    $('.main-content').empty().append(searchResults);
    categoryNews = searchResults;
    searchNews(keywords, categoryNews, true);
    setTimeout(() => {
      $('#search input').val('');
    });
  }
});

// TODO: use facet *section_name* instead of keywords
function searchNews(keywords, categoryNews, isSearch) {
  let startDate = moment('2019').format('YYYYMMDD');
  let endDate = moment().format('YYYYMMDD');
  let searchArticles = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&q=${keywords}&fq=news_desk:("Business", "Your Money", "Entrepreneurs", "Financial", "Business day", "SundayBusiness", "Personal Investing", "Small Business", "Wealth")&begin_date=${startDate}&end_date=${endDate}&sort=newest&api-key=${API_KEY_NT}`;

  $.ajax({
    url: searchArticles,
    method: 'GET',
  })
    .then(function (resp) {
      let results = resp.response.docs;
      console.log(results);

      for (let i = 0; i < results.length; i++) {
        let thumbnail;
        if (results[i].multimedia.length > 0) {
          thumbnail = `'https://www.nytimes.com/${
            results[i].multimedia.find((o) => o.crop_name === 'windowsTile336H')
              .url
          }'`;
        }
        let category = results[i].section_name;
        let title = results[i].headline.main;
        let articleURL = results[i].web_url;
        let abstract = results[i].abstract;
        let leadParagraph = results[i].lead_paragraph;
        let byline = results[i].byline.original;
        let publishedDate = moment(results[i].pub_date).format('LL');
        if (!isSearch) {
          categoryNews = $('.category-news-articles-wrapper').filter(
            function () {
              return $(this).data('category') === keywords;
            }
          );
        }
        categoryNews.find('.row').prepend(
          `<div class="article-wrapper pe-3 pb-4 mb-5">
            <article class="w-100">
              <div class="article-content d-flex flex-column flex-md-row">
                <div class="thumbnail col-sm-12 col-md-4 me-3 position-relative">
                  <div class="thumbnail-bg" style="background-image: url(${
                    thumbnail ? thumbnail : ''
                  })"></div>
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
    })
    .catch((err) => {
      let element = categoryNews.find('row');
      showError(element);
    });
}

function showError(element) {
  if (!$('.error')) {
    element.empty().append(
      `<div class="error pe-3 pb-4">
        <p class="pb-3">Apologies, could not retrive the article.</p>
      </div>`
    );
  }
}
