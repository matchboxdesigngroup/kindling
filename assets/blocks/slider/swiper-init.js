import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

/**
 * Initialize Swiper with settings.
 */
console.log('sliderSwiperInit file loaded');

function sliderSwiperInit() {
  const swiper = new Swiper('.slider-block', {
    autoplay: true,
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,

    pagination: {
      el: '.slider-block__pagination',
      clickable: true,
    },

    // Navigation arrows
    // navigation: {
    //   nextEl: '.slider-block__button--next',
    //   prevEl: '.slider-block__button--prev',
    // },
  });
}

export default sliderSwiperInit;
