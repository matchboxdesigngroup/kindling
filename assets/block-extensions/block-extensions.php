<?php
// Enqueue block extension scripts
function kindling_extend_core_cover_block() {
    // Register and enqueue the block's JavaScript (extending the core block)
    wp_register_script(
        'kindling-video-cover-extend',
        get_template_directory_uri() . '/assets/block-extensions/video-cover/index.js',
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ),
        filemtime( get_template_directory() . '/assets/block-extensions/video-cover/index.js' )
    );

    // Enqueue the script in the editor
    wp_enqueue_script( 'kindling-video-cover-extend' );
}
add_action( 'enqueue_block_editor_assets', 'kindling_extend_core_cover_block' );
?>
