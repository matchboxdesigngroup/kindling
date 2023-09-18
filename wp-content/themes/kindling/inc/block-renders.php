<?php

include dirname(__DIR__) . '/assets/blocks/child-page-navigation-link/index.php';
add_action( 'init', 'register_block_child_page_navigation_link' );

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
      $linked = '<a href="' . esc_attr( $attributes['href'] ) . '" class="mdg-block-link"';
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

/**
 * Publications Categories Link List block server side render.
 *
 * Renders a list of taxonomy terms for the 'publications' post type
 * and the 'publication-category' taxonomy.
 *
 * @param array $attributes The block attributes.
 * @return string The HTML output for the block.
 */
function render_publications_terms_block($attributes) {
    $taxonomy = 'publication-category'; // Hardcoded taxonomy
    $all_terms = get_terms(array('taxonomy' => $taxonomy, 'hide_empty' => false));

    if (empty($all_terms)) {
        return 'No terms found.';
    }

    // Get the current archive term if on a taxonomy archive page
    $current_archive_term = is_tax($taxonomy) ? get_queried_object() : null;

    // Organize terms into a hierarchical structure
    $terms_tree = array();
    foreach ($all_terms as $term) {
        if ($term->parent == 0) {
            $terms_tree[$term->term_id] = array('term' => $term, 'children' => array());
        }
    }
    foreach ($all_terms as $term) {
        if ($term->parent != 0 && isset($terms_tree[$term->parent])) {
            $terms_tree[$term->parent]['children'][] = $term;
        }
    }

    $output = '<div class="wp-block-kindling-publications-categories-link-list publications-categories-link-list">';
    $output .= '<div class="publications-categories-link-list__responsive">';
    // Desktop
    $output .= '<nav class="mb-20 hidden md:block" aria-label="Publication Categories">';
    $output .= '<ul>';
    foreach ($terms_tree as $parent_term) {
        $output .= render_term($parent_term, $current_archive_term);
    }
    $output .= '</ul>';
    $output .= '</nav>';
    // Mobile
    $output .= '<select class="block md:hidden mb-7">';
    foreach ($terms_tree as $parent_term) {
        $output .= render_term_option($parent_term, $current_archive_term);
    }
    $output .= '</select>';
    $output .= '<div class="h-[1px] w-full mb-6 block md:hidden bg-light-grey"></div>';
    $output .= '</div>';
    $output .= '</div>';

    return $output;
}

function render_term($term_tree, $current_archive_term) {
    $term = $term_tree['term'];
    $term_link = esc_url(get_term_link($term));
    $is_current_term = $current_archive_term && $term->term_id == $current_archive_term->term_id;
    $output = '<li class="' . ($is_current_term ? 'current-cat' : '') . '">';
    $output .= '<a href="' . $term_link . '" onclick="window.location.href=\'' . $term_link . '\'" aria-label="View all publications in ' . esc_html($term->name) . '">' . esc_html($term->name) . '</a>';
    if (!empty($term_tree['children'])) {
        $output .= '<ul class="publication-category-submenu">';
        foreach ($term_tree['children'] as $child_term) {
            $output .= render_term(array('term' => $child_term, 'children' => array()), $current_archive_term);
        }
        $output .= '</ul>';
    }
    $output .= '</li>';
    return $output;
}

function render_term_option($term_tree, $current_archive_term) {
    $term = $term_tree['term'];
    $term_link = esc_url(get_term_link($term));
    $is_current_term = $current_archive_term && $term->term_id == $current_archive_term->term_id;
    $output = '<option value="' . $term_link . '"' . ($is_current_term ? ' selected' : '') . '>';
    $output .= esc_html($term->name);
    $output .= '</option>';
    return $output;
}

register_block_type('kindling/publications-categories-link-list', array(
    'render_callback' => 'render_publications_terms_block',
));

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

/**
 * Query Pagination Previous & Next - Extension
 * core/query-pagination-previous
 * core/query-pagination-next
 *
 * Adds a toggle to remove the link text while keeping the <a></a> element
 */
add_filter( 'render_block', function( $block_content, $block ) {
    if ( 'core/query-pagination-previous' === $block['blockName'] ) {
        $disable_text = true;

        if ( $disable_text ) {
            preg_match( '/<a href="([^"]*)"[^>]*>/', $block_content, $matches );
            $href = $matches[1] ?? '#';

            $block_content = preg_replace( '/<a[^>]*>(.*?)<\/a>/', "<a class=\"wp-block-query-pagination-previous\" href=\"{$href}\" aria-label=\"Previous Page\"> </a>", $block_content );
        }
    }

    return $block_content;
}, 10, 2 );

add_filter( 'render_block', function( $block_content, $block ) {
    if ( 'core/query-pagination-next' === $block['blockName'] ) {
        $disable_text = true;

        if ( $disable_text ) {
            preg_match( '/<a href="([^"]*)"[^>]*>/', $block_content, $matches );
            $href = $matches[1] ?? '#';

            $block_content = preg_replace( '/<a[^>]*>(.*?)<\/a>/', "<a class=\"wp-block-query-pagination-next\" href=\"{$href}\" aria-label=\"Previous Page\"> </a>", $block_content );
        }
    }

    return $block_content;
}, 10, 2 );
