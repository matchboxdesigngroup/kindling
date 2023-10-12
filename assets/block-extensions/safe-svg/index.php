<?php

/**
 * Safe SVG extension
 */
function add_custom_class_to_safe_svg_block( $block_content, $block ) {
  if ( 'safe-svg/svg-icon' === $block['blockName'] ) {

      $attributes = $block['attrs'];

      if ( isset( $attributes['iconColor'] ) && ! empty( $attributes['iconColor'] ) && $attributes['iconColor'] !== 'none' ) {
          $block_content = str_replace( 'style="', 'style="color:' . $attributes['iconColor'] . '; ', $block_content );
      }

  }
  return $block_content;
}
add_filter( 'render_block', 'add_custom_class_to_safe_svg_block', 10, 2 );
