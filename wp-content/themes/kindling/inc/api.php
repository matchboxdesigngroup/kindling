<?php
/**
 * REST API functionality
 *
 * @package kindling
 * @since 3.0.0
 */

 /**
 * Remove user endpoints for unauthed users.
 *
 * @param  array $endpoints Array of endpoints
 * @return array
 */
function restrict_user_endpoints( $endpoints ) {
    if ( ! is_user_logged_in() ) {
        $keys = preg_grep( '/\/wp\/v2\/users\b/', array_keys( $endpoints ) );

        foreach ( $keys as $key ) {
            unset( $endpoints[ $key ] );
        }

        return $endpoints;
    }

    return $endpoints;
}
add_filter( 'rest_endpoints', 'restrict_user_endpoints' );
