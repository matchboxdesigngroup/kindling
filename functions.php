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
 * Kindling theme version constant.
 *
 * Defines the Kindling theme version constant by retrieving the version number
 * from the theme's style.css file using the WordPress get_theme() function.
 *
 * @since 3.0.0
 * @var string $KINDLING_VERSION The version number of the Kindling theme.
 * 
 */
define( 'KINDLING_VERSION', wp_get_theme()->get( 'Version' ) );

/**
 * Backward compatibility check for the Kindling theme.
 *
 * Checks if the current WordPress version or PHP version is lower than the
 * minimum requirements for the Kindling theme, and includes the appropriate
 * back-compat file if necessary.
 * 
 * @since 3.0.0
 * @return void
 */
if ( version_compare( $GLOBALS['wp_version'], '6.0-RC4-53425', '<' ) || version_compare( PHP_VERSION_ID, '70400', '<' ) ) {
  include get_template_directory() . '/includes/back-compat.php';
  return;
}

/**
 * Add theme support for block styles and editor style.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_setup() {
  add_theme_support( 'wp-block-styles' );
  add_editor_style( 'dist/css/editor.css' );

  remove_theme_support('core-block-patterns');
}
add_action( 'after_setup_theme', 'kindling_setup' );

/**
 * Enqueues the Kindling parent theme stylesheet and the app stylesheet.
 *
 * The `kindling-style` stylesheet is enqueued with a dependency on the parent theme 
 * stylesheet URI and the `KINDLING_VERSION` constant for cache-busting.
 *
 * The `app` stylesheet is enqueued with a dependency on the `get_theme_file_uri()` 
 * function to retrieve the URI for the stylesheet and the `filemtime()` function to 
 * cache-bust the stylesheet based on its modification time.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_styles() {
	wp_enqueue_style(
		'kindling-style',
		get_stylesheet_uri(),
		array(),
		KINDLING_VERSION
	);

	wp_enqueue_style(
		'app',
		get_theme_file_uri( 'dist/css/app.css' ),
		array(),
		filemtime( get_template_directory() . '/dist/css/app.css' )
	);
}
add_action( 'wp_enqueue_scripts', 'kindling_styles' );

/**
 * Enqueues the app.js script.
 *
 * The `app` script is enqueued with a dependency on the `get_theme_file_uri()` 
 * function to retrieve the URI for the script and the `filemtime()` function to 
 * cache-bust the script based on its modification time.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_scripts() {
  wp_enqueue_script(
    'app',
    get_theme_file_uri( 'dist/js/app.js' ),
    array(),
    filemtime( get_template_directory() . '/dist/js/app.js' )
  );
}
add_action( 'wp_enqueue_scripts', 'kindling_scripts' );

/**
 * Enqueue the editor JS files.
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_editor_scripts() {
    wp_enqueue_script(
        'editor-js',
        get_theme_file_uri( 'dist/js/editor.js' ),
        [ 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-editor' ],
        filemtime( get_template_directory() . '/dist/js/editor.js' )
    );
}
add_action( 'enqueue_block_editor_assets', 'kindling_editor_scripts' );
