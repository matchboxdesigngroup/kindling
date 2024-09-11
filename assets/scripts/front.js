/**
 * Front End Styles
 */
import '../styles/front.scss';

// Slider block
import sliderSwiperInit from '../blocks/slider/swiper-init';

// A11y
import coverBlockRolePresentation from './a11y/cover-block/presentation-role';

// Animations: AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Better Mobile Menu
 */
import { initializeMenu } from './better-mobile-menu/better-mobile-menu';

jQuery(document).ready(function ($) {
  // Initialize the better mobile menu feature
  initializeMenu();
});

/**
 * Frontend scripts
 */
document.addEventListener('DOMContentLoaded', function () {

  // Initialize AOS animation library
  AOS.init({
    duration: '700',
    once: true,
  });

  /* Any anchor link smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    });
  });

  // Column classes
  function columnClasses() {
    const columnBlocks = document.querySelectorAll('.wp-block-columns');

    columnBlocks.forEach((block) => {
      const columns = block.querySelectorAll('.wp-block-column');
      const columnCount = columns.length;

      // Add new class based on column count
      block.classList.add(`has-${columnCount}-columns`);
    });
  }
  columnClasses();

  /**
  * A11y
  */
  // Add role = presentation to cover block bg image
  coverBlockRolePresentation();

  // Blocks
  sliderSwiperInit(); // Slider block

});
