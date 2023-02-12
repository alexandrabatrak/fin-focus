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
