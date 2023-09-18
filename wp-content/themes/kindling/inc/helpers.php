<?php
/**
 * Helper functions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package kindling
 * @since 3.0.0
 */

/**
 * Implement dump and die: dd($var).
 *
 * @since 3.0.0
 *
 * @return mixed
 */
if (!function_exists('dd')) {
    function dd($data) {
        ini_set("highlight.comment", "#969896; font-style: italic");
        ini_set("highlight.default", "#FFFFFF");
        ini_set("highlight.html", "#D16568");
        ini_set("highlight.keyword", "#7FA3BC; font-weight: bold");
        ini_set("highlight.string", "#F2C47E");
        $output = highlight_string("<?php\n\n" . var_export($data, true), true);
        echo "<div style=\"background-color: #1C1E21; padding: 1rem\">{$output}</div>";
        die();
    }
}

/**
 * Disable block recommendations
 */
add_action('admin_init', function () {
    remove_action('enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets');
});
