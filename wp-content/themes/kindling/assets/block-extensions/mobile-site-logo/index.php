<?php

/**
 * Mobile Site Logo block extension render
 */
function add_mobile_logo_attribute( $args, $block_name ) {
  if ( $block_name === 'core/site-logo' ) {
    $args['attributes']['logo2'] = array(
      'type' => 'integer',
    );
  }
  return $args;
}
add_filter( 'register_block_type_args', 'add_mobile_logo_attribute', 10, 2 );

function render_mobile_logo( $block_content, $block ) {
  if ( $block['blockName'] === 'core/site-logo' && ! empty( $block['attrs']['logo2'] ) ) {
    $mobile_image = wp_get_attachment_image( $block['attrs']['logo2'], 'full', false, array( 'class' => 'custom-logo' ) );
    $block_content .= '<div class="is-style-default wp-block-site-logo wp-block-site-logo--mobile">';
    $block_content .= '<a href="' . esc_url( home_url( '/' ) ) . '" class="custom-logo-link custom-logo-link--mobile" rel="home" aria-current="page">' . $mobile_image . '</a>';
    $block_content .= '</div>';
  }
  return $block_content;
}
add_filter( 'render_block', 'render_mobile_logo', 10, 2 );
