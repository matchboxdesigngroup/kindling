<?php

/**
 * Functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package kindling
 * @since 3.0.0
 */

/**
 * The theme version.
 *
 * @since 3.0.0
 */
define('KINDLING_VERSION', wp_get_theme()->get('Version'));

/**
 * Check if the WordPress version is 6.0 or higher, and if the PHP version is at least 7.4.
 * If not, do not activate.
 */
if (version_compare($GLOBALS['wp_version'], '6.0-RC4-53425', '<') || version_compare(PHP_VERSION_ID, '70400', '<')) {
  include get_template_directory() . '/inc/back-compat.php';
  return;
}

/**
 * Add theme support for block styles and editor style.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_setup()
{
  add_theme_support('wp-block-styles');

  remove_theme_support('core-block-patterns');
}
add_action('after_setup_theme', 'kindling_setup');

/**
 * Enqueue the CSS files.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_styles()
{
  wp_enqueue_style(
    'kindling-style',
    get_stylesheet_uri(),
    [],
    KINDLING_VERSION
  );
  wp_enqueue_style(
    'front',
    get_theme_file_uri('build/front.css'),
    [],
    filemtime(get_template_directory() . '/build/front.css')
  );
}
add_action('wp_enqueue_scripts', 'kindling_styles');

/**
 * Enqueue the JS files.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_scripts()
{
  wp_enqueue_script(
    'front',
    get_theme_file_uri('build/front.js'),
    [],
    filemtime(get_template_directory() . '/build/front.js')
  );
}
add_action('wp_enqueue_scripts', 'kindling_scripts');

/**
 * Enqueue the editor JS files.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_editor_assets()
{
  wp_enqueue_script(
    'editor-js',
    get_theme_file_uri('build/editor.js'),
    ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-editor', 'wp-dom-ready', 'wp-edit-post'],
    filemtime(get_template_directory() . '/build/editor.js')
  );
  wp_enqueue_style(
    'editor',
    get_theme_file_uri('build/editor.css'),
    [],
    filemtime(get_template_directory() . '/build/editor.css')
  );
  // Block Variations
  wp_enqueue_script(
    'kindling-block-variations',
    get_theme_file_uri('build/blockVariations.js'),
    array('wp-blocks', 'wp-i18n', 'wp-dom-ready'),
    filemtime(get_template_directory() . ('build/blockVariations.js')), // Version for cache busting.
    true // In footer.
  );
}
add_action('enqueue_block_editor_assets', 'kindling_editor_assets');

// Helpers.
require_once get_theme_file_path('inc/helpers.php');

// ACF Blocks.
require_once get_theme_file_path('inc/api.php');
require_once get_theme_file_path('inc/acf-blocks.php');

// Authors.
require_once get_theme_file_path('inc/authors.php');

// Block styles.
require_once get_theme_file_path('inc/block-styles.php');

// Block variations.
//require_once get_theme_file_path( 'inc/register-block-variations.php' );

// Block patterns.
require_once get_theme_file_path('inc/block-patterns.php');

// Block renders.
require_once get_theme_file_path('inc/block-renders.php');

// Disable comments
require_once get_theme_file_path('inc/comments.php');

// Google Analytics
require_once get_theme_file_path('inc/google-analytics.php');

// WooCommerce setup.
if (class_exists('WooCommerce')) {
  require_once get_theme_file_path('inc/woocommerce.php');
}
