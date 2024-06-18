/**
 * Front End Styles
 */
import '../styles/front.scss';

/**
 * Swiper bundle with all modules installed
 */
// TODO only import what we need
import Swiper from 'swiper/bundle';

/**
 * Swiper CSS bundle
 */
// TODO only import what we need
import 'swiper/css/bundle';

// A11y
import coverBlockRolePresentation from './a11y/cover-block/presentation-role';

// Animations: AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Frontend scripts
 */
document.addEventListener('DOMContentLoaded', function () {

  // Initialize AOS animation library
  AOS.init({
    duration: '700',
    // mirror: true,
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

  /**
  * A11y
  */
  // Add role = presentation to cover block bg image
  coverBlockRolePresentation();

});
