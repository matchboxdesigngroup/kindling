// TODO only import what we need
// Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// TODO only import what we need
// Swiper styles bundle
import 'swiper/css/bundle';

/**
  * Slider block headings for side "bullets" nav
  */
  let slideBlocks = document.getElementsByClassName('wp-block-kindling-slide-block');

  let titles = [];

  if (slideBlocks.length > 0) {
    Array.from(slideBlocks).forEach(el => {
      let slideHeading = el.querySelector('.wp-block-heading');

      if (slideHeading && slideHeading !== null) {
        slideHeading.dataset.title = slideHeading.innerHTML;

        titles.push(slideHeading.innerHTML);
        return titles;
      }
    });
  }



document.addEventListener('DOMContentLoaded', function () {

  let sliders = document.querySelectorAll('.slider-block');

  sliders.forEach(slider => {
    new Swiper(slider, {
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
      },
      autoHeight: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      loop: true,
      pagination: {
        el: slider.querySelector('.slider-block__pagination'),
        clickable: true,
        // The registerBlockType function has 'supports: multiple' set to false so this block can only be added to a page once
        // The Swiper code here has been updated to enable multiple blocks on a page
        // But there is a bug in this renderBullet function. The headings that make up the navigation on the left will
        // load from the second to the last block. So if you have two sliders, they will come from the first one.
        // It should be easy to fix but I ran into a wall with it.
        renderBullet: function (index, className) {
          let heading = this.slides[index].querySelector('.wp-block-heading').innerHTML;
          return '<span class="pagination-item ' + className + '">' + heading + '</span>';
        },
      },
      navigation: {
        nextEl: slider.querySelector('.slider-block__button--next'),
        prevEl: slider.querySelector('.slider-block__button--prev'),
      },
    });
  });
});
