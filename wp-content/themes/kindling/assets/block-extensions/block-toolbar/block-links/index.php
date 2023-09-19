<?php

/**
 * Block link.
 *
 * @param mixed $block_content The block content.
 * @param array $block The block data.
 *
 * @return mixed Returns the new block content.
 */
function render_link_toolbar( $block_content, $block ) {
  if (
    isset( $block['blockName'] ) &&
    ( in_array( $block['blockName'], array(
        'core/group',
        'core/column',
        'core/cover',
        'kindling/arrow-cta',
        'safe-svg/svg-icon'
    ) ) )
  ) {
    $attributes = $block['attrs'];

    if ( isset( $attributes['href'] ) && ! empty( $attributes['href'] ) ) {
      $linked = '<a href="' . esc_attr( $attributes['href'] ) . '" class="kindling-block-link"';
      $rel    = ' rel="';

      if ( isset( $attributes['opensInNewTab'] ) && $attributes['opensInNewTab'] ) {
        $linked .= ' target="_blank"';
        $rel    .= ' noreferrer noopener';
      }

      if ( isset( $attributes['linkNoFollow'] ) && $attributes['linkNoFollow'] ) {
        $rel .= ' nofollow';
      }

      if ( isset( $attributes['linkSponsored'] ) && $attributes['linkSponsored'] ) {
        $rel .= ' sponsored';
      }

      // Add aria-label if it exists and is not empty
      if ( isset( $attributes['ariaLabel'] ) && ! empty( $attributes['ariaLabel'] ) ) {
        $linked .= ' aria-label="' . esc_attr( $attributes['ariaLabel'] ) . '"';
      }

      $rel    .= '"';
      $linked .= $rel;

      $linked .= '></a>';

      $reg   = '~(.*)</div>~su';
      $subst = '${1}' . $linked . '</div>';

      $block_content = preg_replace( $reg, $subst, $block_content );
    }
  }

  return $block_content;
}
add_filter('render_block', 'render_link_toolbar', 10, 2);
