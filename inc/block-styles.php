<?php
/**
 * Block styles.
 *
 * @package kindling
 * @since 3.0.0
 */

/**
 * Register block styles
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_register_block_styles() {

    /* Buttons Block */
    register_block_style('core/button', [
        'name' => 'btn-primary',
        'label' => 'Primary',
        'is_default'   => true,
    ]);

    register_block_style('core/button', [
        'name' => 'btn-secondary',
        'label' => 'Secondary',
    ]);

    register_block_style('core/button', [
        'name' => 'btn-tertiary',
        'label' => 'Tertiary',
    ]);

    /* Image Block */
    register_block_style('core/image', [
        'label' => 'Cover',
        'name'  => 'img-cover',
    ]);

    /* List Block */
    register_block_style('core/list', [
        'name' => 'list-disc',
        'label' => 'Bullet',
    ]);

    register_block_style('core/list', [
        'name' => 'list-none',
        'label' => 'None',
    ]);

}
add_action( 'init', 'kindling_register_block_styles' );
