<?php

/**
 * Add Gutenberg support for WooCommerce product pages
 */
add_filter('use_block_editor_for_post_type', function ($can_edit, $post_type) {
    if ($post_type == 'product') {
        $can_edit = true;
    }

    return $can_edit;
}, 10, 2);

/**
 * Remove the "Description" heading from the product single
 */
add_filter('woocommerce_product_description_heading', '__return_null');

/**
 * Remove the default WooCommerce breadcrumbs
 */
remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20, 0);

add_theme_support( 'wc-product-gallery-zoom' );
add_theme_support( 'wc-product-gallery-lightbox' );
add_theme_support( 'wc-product-gallery-slider' );

/**
 * Woocommerce support with settings.
 */
function mytheme_add_woocommerce_support() {
  add_theme_support( 'woocommerce', array(
    'thumbnail_image_width' => 150,
    'single_image_width'    => 300,

    'product_grid'          => array(
        'default_rows'    => 3,
        'min_rows'        => 2,
        'max_rows'        => 8,
        'default_columns' => 4,
        'min_columns'     => 2,
        'max_columns'     => 5,
      ),
  ) );
}

add_action( 'after_setup_theme', 'mytheme_add_woocommerce_support' );
