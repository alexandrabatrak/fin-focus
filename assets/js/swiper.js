const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  slidesPerView: 7,
  spaceBetween: 0,
  initialSlide: 5,
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
      slidesPerView: 2,
      spaceBetween: 0,
    },
    576: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 0,
    },
    992: {
      slidesPerView: 5,
      spaceBetween: 0,
    },
    1100: {
      slidesPerView: 5,
      spaceBetween: 0,
    },
    1400: {
      slidesPerView: 7,
      spaceBetween: 0,
    },
  },
});
const swiperCrypto = new Swiper('.swiper-crypto', {
  // Optional parameters
  direction: 'horizontal',
  slidesPerView: 2,
  spaceBetween: 0,
  initialSlide: 0,
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    350: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    576: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 0,
    },
    992: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    1200: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
  },
});
