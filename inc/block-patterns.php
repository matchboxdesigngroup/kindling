<?php
/**
 * Block patterns
 *
 * @package kindling
 * @since 3.0.0
 */

/**
 * Register block pattern categories.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_register_block_pattern_category() {

    register_block_pattern_category(
        'kindling-components',
        array( 'label' => esc_html__( 'Kindling - Components', 'kindling' ) )
    );

    register_block_pattern_category(
        'kindling-pages',
        array( 'label' => esc_html__( 'Kindling - Page Layouts', 'kindling' ) )
    );

    register_block_pattern_category(
        'kindling-sections',
        array( 'label' => esc_html__( 'Kindling - Page Sections', 'kindling' ) )
    );

    register_block_pattern_category(
        'kindling-blog',
        array( 'label' => esc_html__( 'Kindling - Blog layouts', 'kindling' ) )
    );
}
add_action( 'init', 'kindling_register_block_pattern_category', 9 );
