<?php
/**
 * ACF Blocks
 *
 * @package kindling
 * @since 3.0.0
 */

/**
 * Set local json load path.
 *
 * @since 3.0.0
 *
 * @param  string $path Unmodified local path for acf-json.
 * @return string       Our modified local path for acf-json.
 */
add_filter('acf/settings/save_json', function( $path ) {
    $path = get_stylesheet_directory() . '/assets/acf-json';
    return $path;
});

/**
 * Registers ACF Blocks.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_register_acf_blocks() {
    register_block_type( dirname(__DIR__, 1) . '/assets/acf-blocks/block-name' );
}
add_action( 'init', 'kindling_register_acf_blocks' );

/**
 * Generates CSS styles for spacing properties (margin and padding) based on the provided block configuration.
 * Used with ACF Gutenberg blocks.
 *
 * @param array $block The block configuration array containing the spacing properties.
 * @return string The generated CSS styles as a string.
 */

// Usage example:
// $styles = generateSpacingStyles($block);

function generateSpacingStyles(array $block): string {
  $styles = '';
  $spacing_properties = ['margin', 'padding'];

  // Iterate through the spacing properties (margin and padding)
  foreach ($spacing_properties as $spacing) {
      // Iterate through the sides (top, right, bottom, left)
      foreach (['top', 'right', 'bottom', 'left'] as $side) {
          // Check if the side is defined for the current spacing property
          if (isset($block['style']['spacing'][$spacing][$side])) {
              $value = $block['style']['spacing'][$spacing][$side];
              // Check if the value is not an empty string
              if ($value !== '') {
                  $styles .= "{$spacing}-{$side}:{$value};";
              }
          }
      }
  }

  return $styles;
}

/**
* Function to handle link HTML generation.
*
* @param array $link Associative array containing the link attributes.
*/
function print_link($link) {
  if ($link) {
    $link_title = !empty($link['title']) ? esc_html($link['title']) : '';
    $link_url   = !empty($link['url']) ? esc_url($link['url']) : '';
    $link_target = !empty($link['target']) ? $link['target'] : '';
    $link_rel   = !empty($link['rel']) ? $link['rel'] : '';
    echo '<a href="' . $link_url . '" target="' . esc_attr($link_target, $link_rel) . '" class="regions-map__cta btn-primary">' . $link_title . '</a>';
  }
}

// Validate ACF fields with Gutenberg
function _validate_save_post() {

    // bail early if no $_POST
    $acf = false;
    foreach($_POST as $key => $value) {
        if (strpos($key, 'acf') === 0) {
            if (! empty( $_POST[$key] ) ) {
                acf_validate_values( $_POST[$key], $key);
            }
        }
    }
}
add_action( 'acf/validate_save_post', '_validate_save_post', 5 );
