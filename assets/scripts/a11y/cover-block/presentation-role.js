/**
 * Function to add role="presentation" attribute to all images with class
 * 'wp-block-cover__image-background' which are children of 'wp-block-cover' divs.
 * This makes the images ignored by screen readers for accessibility purposes.
 * @returns {void}
 */
function coverBlockRolePresentation() {
  // Use querySelectorAll to find all div elements with the class 'wp-block-cover'
  let coverDivs = document.querySelectorAll('.wp-block-cover');

  // Check if the coverDivs are not null
  if(coverDivs) {
    // Loop over the divs
    coverDivs.forEach(coverDiv => {
      // Within each div, find all images with the class 'wp-block-cover__image-background'
      let images = coverDiv.querySelectorAll('.wp-block-cover__image-background');

      // Loop over the images
      images.forEach(image => {
        // Set the role attribute of each image to 'presentation'
        image.setAttribute('role', 'presentation');
      });
    });
  }
}

export default coverBlockRolePresentation;
