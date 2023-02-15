// date
$('#today-date').append(moment().format('dddd, MMMM Do YYYY'));
// weather
const API_KEY_WEATHER = '01990277676ad45f8bc3f867a4878557';
const query = `https://api.openweathermap.org/data/2.5/weather?lat=51.5085&lon=-0.1257&units=metric&appid=${API_KEY_WEATHER}`;
$.ajax({
  url: query,
  method: 'GET',
})
  .then(function (result) {
    if (result.cod === 200) {
      let name = result.name;
      let country = result.sys.country;
      let icon = result.weather[0].icon;
      let temp = Math.floor(result.main.temp);

      let todayWeatherDisplay = $(
        `<div class="position-relative">
          <span>${name}</span><sup>${country}</sup>
          <img src="https://openweathermap.org/img/wn/${icon}.png"/>
          <span class="list-inline-item">${temp}&#8451</span>
        </div>`
      );
      $('#weather').append(todayWeatherDisplay);
    }
  })
  .catch((err) => console.log(err));

// search input focus
$('#search input')
  .on('focus', () => $('#search').addClass('focus'))
  .on('blur', () => $('#search').removeClass('focus'));

// Height of the contact content
function contactHeight() {
  if ($('body').hasClass('contact')) {
    $('#contact').css({
      'min-height': `calc(100vh - ${$('header').outerHeight(true)}px - ${$(
        'footer'
      ).outerHeight(true)}px)`,
    });
  }
}
contactHeight();

// copyright year
$('#year').text(moment().format('YYYY'));

AOS.init({
  easing: 'ease-in-out',
  // once: true,
  duration: 600,
});
