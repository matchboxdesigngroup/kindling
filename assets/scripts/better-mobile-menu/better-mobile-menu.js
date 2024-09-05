/**
 * Prevent body scroll when the mobile menu is open
 * @param {*} prevent
 */
function toggleBodyScroll(prevent) {
  if (prevent) {
    document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.overflowY = '';
  }
}

/**
 * Check if the current view is mobile
 * @returns {boolean}
 */
function isMobileView() {
  return jQuery(window).width() < 960;
}

/**
 * Observe the menu container for changes
 */
function observeMenu() {
  const menuContainer = document.querySelector('.wp-block-navigation__responsive-container');

  if (menuContainer) {
    // Initial check to set the correct body scroll state based on the initial menu state
    const isMenuOpen = menuContainer.classList.contains('has-modal-open') && menuContainer.classList.contains('is-menu-open');
    toggleBodyScroll(isMenuOpen);

    // Create an observer instance
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isMenuNowOpen = mutation.target.classList.contains('has-modal-open') && mutation.target.classList.contains('is-menu-open');
          toggleBodyScroll(isMenuNowOpen);
        }
      });
    });

    // Configuration of the observer:
    const config = { attributes: true };

    // Pass in the target node, as well as the observer options
    observer.observe(menuContainer, config);
  }
}

/**
 * Close all open submenus
 */
function closeAllSubmenus() {
  jQuery('.wp-block-navigation__submenu-container.is-open').each(function() {
    heightclose.call(this); // Close all open submenus
  });
}

/**
 * Open the submenu
 */
function heightopen() {
  closeAllSubmenus(); // Close any open submenus first
  const scrollHeight = jQuery(this).get(0).scrollHeight;
  toggleBodyScroll(true);
  jQuery(this).height(scrollHeight).addClass('is-open'); // Set height and add class to open
  jQuery(this).attr('aria-expanded', 'true'); // Set ARIA attribute for screen readers
  jQuery(this).parent('.wp-block-navigation-item.has-child').addClass('is-submenu-open');
  // Add a class to the parent link to indicate that the submenu is open
  jQuery(this).siblings('.wp-block-navigation-item__content').addClass('is-open');
  // Set the dropdown arrow area-expanded to true
  jQuery(this).siblings('.wp-block-navigation-submenu__toggle').attr('aria-expanded', 'true'); // Set ARIA attribute for screen readers

  // Add tabindex to submenu items
  let submenuLinks = jQuery(this).find('a');
  submenuLinks.attr('tabindex', '0');

  // Disable the submenu toggle buttons from keyboard tab order since the li already opens the submenu
  const buttons = jQuery('.wp-block-navigation-submenu__toggle');
  buttons.attr('tabindex', '-1');
}

/**
 * Close the submenu
 */
function heightclose() {
  const currentHeight = jQuery(this).height();
  toggleBodyScroll(false);

  jQuery(this).height(currentHeight) // Set the current height explicitly to start transition
    .animate({ height: 0 }, 300, function() { // Replace 300 with your transition duration
      jQuery(this).removeClass('is-open').height(''); // Remove 'is-open' class and reset height after animation
      jQuery(this).attr('aria-expanded', 'false'); // Update ARIA attribute
      jQuery(this).parent('.wp-block-navigation-item.has-child').removeClass('is-submenu-open');
      // Add a class to the parent link to indicate that the submenu is open
      jQuery(this).siblings('.wp-block-navigation-item__content').removeClass('is-open');
      // Set the dropdown arrow area-expanded to false
      jQuery(this).siblings('.wp-block-navigation-submenu__toggle').attr('aria-expanded', 'false'); // Set ARIA attribute for screen readers

    });

  // Remove tabindex to submenu items
  let submenuItems = jQuery(this).find('a');
  submenuItems.attr('tabindex', '-1');
}

/**
 * Open or close the submenu based on its current state
 */
function heightopenclose() {
  if (jQuery(this).hasClass('is-open')) {
    heightclose.call(this); // Use 'call' to ensure 'this' refers to the submenu
  } else {
    heightopen.call(this); // Similarly, ensure 'this' refers to the submenu
  }
}

/**
 * Main function to enhance the mobile menu
 */
function betterMobileMenu() {
  // Select all submenu toggle buttons within WordPress block navigation menus.
  const buttons = jQuery('.wp-block-navigation-submenu__toggle');

  if (buttons.length) {
    // Disable the submenu toggle buttons from keyboard tab order since the li already opens the submenu
    buttons.attr('tabindex', '-1');
  }

  // Select all submenu items within WordPress block navigation menus.
  var justTheSubmenu = jQuery('.wp-block-navigation__submenu-container.wp-block-navigation-submenu');
  var theSubmenuLI = jQuery('.wp-block-navigation__submenu-container.wp-block-navigation-submenu li');
  var allSubmenuItems = jQuery('.wp-block-navigation__submenu-container.wp-block-navigation-submenu a'); // This selects the elements
  theSubmenuLI.attr('tabindex', '-1'); // This sets tabindex="-1" for the parent element submenu ul
  justTheSubmenu.attr('tabindex', '-1'); // This sets tabindex="-1" for the submenu li
  allSubmenuItems.attr('tabindex', '-1'); // This sets tabindex="-1" for each submenu li a

  if (isMobileView()) {
    jQuery('.wp-block-navigation__submenu-container.wp-block-navigation-submenu li').each(function() {
      jQuery(this).css('cursor', 'pointer').off('click').on('click', function(event) {
        const $target = jQuery(event.target);

        // If the clicked element is not a link, toggle the submenu
        if (!$target.is('a') && !$target.closest('a').length) {
          event.preventDefault(); // Prevent default link action
          event.stopPropagation(); // Stop the event from bubbling up

          const submenu = jQuery(this).find('.wp-block-navigation__submenu-container').first();
          heightopenclose.call(submenu); // Toggle the submenu
        }
        // If the clicked element is a link, let the browser handle it (i.e., do nothing here)
      });
    });

    // Disable the submenu toggle buttons from keyboard tab order since the li already opens the submenu
    buttons.attr('tabindex', '-1');

    buttons.each(function() {
      const $this = jQuery(this);
      const parentLi = $this.closest('li');
      const parentLink = parentLi.find('> a.wp-block-navigation-item__content').first();
      const submenu = parentLi.find('.wp-block-navigation__submenu-container').first();

      // Check if the submenu has already been processed to avoid cloning the link again
      if (!submenu.data('processed')) {
        // Mark the submenu as processed
        submenu.data('processed', true);

        if (parentLink.length && submenu.length) {
          const clonedLink = parentLink.clone();
          const newLi = jQuery('<li class="has-medium-font-size wp-block-navigation-item wp-block-navigation-link"></li>').append(clonedLink);
          submenu.prepend(newLi);
        }
      }

      // Make the entire 'li' clickable, triggering the submenu
      if (submenu.length) {
        // Prevent the default action when clicking directly on the parent link if it's supposed to toggle the submenu
        parentLink.on('click', function(event) {
          // This condition ensures that we only prevent default action if the submenu exists and we're in mobile view
          event.preventDefault(); // Prevent the default link behavior
          event.stopPropagation(); // Stop the event from propagating to parent elements
          heightopenclose.call(submenu); // Toggle the submenu
        });

        parentLi.on('click', function(event) {
          // If the user clicks on parts of the li that are not the link (e.g., padding areas), also toggle the submenu
          if (jQuery(event.target).is(this)) { // Checks if the clicked area is not the child link but the LI itself
            event.preventDefault(); // Still prevent default action
            event.stopPropagation(); // And stop event propagation
            heightopenclose.call(submenu); // Toggle the submenu
          }
        });
      }

      $this.on('click', function(event) {
        event.preventDefault(); // Prevent default button action
        event.stopPropagation(); // Stop the event from bubbling up
        heightopenclose.call(submenu); // Toggle the submenu
      });

      $this.on('focus', function() {
        // Open the submenu when the toggle button is focused
        heightopen.call(jQuery(this).closest('li').find('.wp-block-navigation__submenu-container').get(0));
      });
    });
  } else {
    buttons.attr('tabindex', '0');
    allSubmenuItems.attr('tabindex', '0');
  }
}

/**
 * Handle the resize event to close the mobile menu when width is greater than 960px
 */
function handleResize() {
  if (jQuery(window).width() >= 960) {
    // Check if the menu is currently open
    const menuContainer = document.querySelector('.wp-block-navigation__responsive-container');

    if (menuContainer && (menuContainer.classList.contains('has-modal-open') || menuContainer.classList.contains('is-menu-open'))) {
      // Close the menu by removing the necessary classes
      menuContainer.classList.remove('has-modal-open', 'is-menu-open');

      // Reset body scroll to allow scrolling
      toggleBodyScroll(false);

      // Reset all menu styling to default for desktop view
      closeAllSubmenus(); // Close all submenus if they are open
      jQuery('.wp-block-navigation__submenu-container').removeAttr('style');
      jQuery('.wp-block-navigation-item').removeClass('is-submenu-open');
      jQuery('.wp-block-navigation__submenu-container').removeClass('is-open').attr('aria-expanded', 'false');
      jQuery('.wp-block-navigation-submenu__toggle').attr('aria-expanded', 'false');
    }
  }
}

// Initialize menu enhancements and add resize event listener
function initializeMenu() {
  const menuContainer = document.querySelector('.wp-block-navigation__responsive-container');

  if (menuContainer) {
    observeMenu();
    betterMobileMenu();
  }

  // Add the resize event listener
  jQuery(window).resize(handleResize);
}

export { betterMobileMenu, initializeMenu };
