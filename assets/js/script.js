API_KEY = 'FwLzNfy2zMccC5ApnWI1jbUfKos1SA1n';
let articleLink =
  'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=${API_KEY}&fq=news_desk:("Business Day", "Business", "Entrepreneurs", "Financial", "Your Money")';

$.ajax({
  url: articleLink,
  method: 'GET',
}).then(function (result) {
  console.log(result);
});
