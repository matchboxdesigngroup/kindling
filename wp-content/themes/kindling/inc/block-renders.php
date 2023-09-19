<?php

/* Custom block server-side renders */
include dirname(__DIR__) . '/assets/blocks/child-page-navigation-link/index.php';
include dirname(__DIR__) . '/assets/blocks/publications-taxonomy-terms-list/index.php';

/* Custom block register when using block.json */
add_action( 'init', 'register_block_child_page_navigation_link' );

/* Block extension server-side renders */
include dirname(__DIR__) . '/assets/block-extensions/block-toolbar/block-links/index.php';
include dirname(__DIR__) . '/assets/block-extensions/mobile-site-logo/index.php';
include dirname(__DIR__) . '/assets/block-extensions/safe-svg/index.php';





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
