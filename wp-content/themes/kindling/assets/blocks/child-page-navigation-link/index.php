<?php
/**
 * Renders the `kindling/child-page-navigation-link` block on the server.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Block default content.
 *
 * @return string Returns the next or previous page link that is adjacent to the current page.
 */
function render_block_child_page_navigation_link( $attributes, $content ) {
	if ( ! is_singular() ) {
		return '';
	}

	global $post;
	$parent_id = $post->post_parent;

	// Check if the current post has a parent
	if ( $parent_id === 0 ) {
		return ''; // No parent found
	}

  // Only include immediate children of this parent
  // 'parent' => $parent_id
	$siblings = get_pages( array(
		'child_of' => $parent_id,
    'parent' => $parent_id,
		'sort_column' => 'menu_order',
	) );

	// Check if the parent has more than one child
	if ( count( $siblings ) <= 1 ) {
		return ''; // No siblings found
	}

	$current_index = array_search( $post, $siblings );
	$navigation_type = isset( $attributes['type'] ) ? $attributes['type'] : 'next';

	if ( 'next' === $navigation_type ) {
		$adjacent_index = $current_index + 1;
	} else {
		$adjacent_index = $current_index - 1;
	}

	// Check if the adjacent index is within bounds
	if ( ! isset( $siblings[ $adjacent_index ] ) ) {
		return ''; // No adjacent post found
	}

	$adjacent_post = $siblings[ $adjacent_index ];
	$link = get_permalink( $adjacent_post->ID );

	$classes = "child-page-navigation-link-$navigation_type";
	if ( isset( $attributes['textAlign'] ) ) {
		$classes .= " has-text-align-{$attributes['textAlign']}";
	}
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classes ) );

	// Set default values.
	$label = isset( $attributes['label'] ) ? "{$attributes['label']}:" : '';
	$title = isset( $attributes['showTitle'] ) && $attributes['showTitle'] ? "<span class='child-page-navigation-link__title'>{$adjacent_post->post_title}</span>" : '';

	// Display arrows.
	$arrow_map = array(
		'none'    => '',
		'arrow'   => array(
			'next'     => '→',
			'previous' => '←',
		),
		'chevron' => array(
			'next'     => '»',
			'previous' => '«',
		),
	);

	$arrow = '';
	if ( isset( $attributes['arrow'] ) && ! empty( $attributes['arrow'] ) && 'none' !== $attributes['arrow'] ) {
		$arrow = "<span class='wp-block-child-page-navigation-link__arrow-{$navigation_type} is-arrow-{$attributes['arrow']}' aria-hidden='true'>{$arrow_map[ $attributes['arrow'] ][ $navigation_type ]}</span>";
	}

	$content = "<a href='{$link}' rel='{$navigation_type}'><span class='child-page-navigation-link__label'>{$label}</span> {$title}</a> {$arrow}";

	return sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Registers the `kindling/child-page-navigation-link` block on the server side.
 */
function register_block_child_page_navigation_link() {
	register_block_type_from_metadata(
		__DIR__,
		array(
			'render_callback' => 'render_block_child_page_navigation_link',
		)
	);
}
add_action( 'init', 'register_block_child_page_navigation_link' );
