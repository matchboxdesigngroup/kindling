<?php
/**
 * Authors
 *
 * @package kindling
 * @since 3.0.0
 */

/**
 * Dissable author archive
 *
 * @since 3.0.0
 *
 * @return void
 */
function disable_author_archive() {

    if ( ! is_author() || is_admin() ) {
        return;
    }

    wp_safe_redirect( home_url(), '301', 'kindling' );
    exit();
}
add_action( 'wp', 'disable_author_archive' );
