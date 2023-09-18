<?php
/**
 * Completely disable comments and trackbacks
 *
 * @package kindling
 * @since 3.0.0
 */

/**
 * Dissable support in post types
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_disable_comments_post_types_support() {
    $post_types = get_post_types();
    foreach ($post_types as $post_type) {
        if (post_type_supports($post_type, 'comments')) {
            remove_post_type_support($post_type, 'comments');
            remove_post_type_support($post_type, 'trackbacks');
        }
    }
}
add_action('admin_init', 'kindling_disable_comments_post_types_support');

/**
 * Remove "Comments" menu item from the admin dashboard
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_disable_comments_menu_item() {
    remove_menu_page('edit-comments.php');
}
add_action('admin_menu', 'kindling_disable_comments_menu_item');

/**
 * Remove "Comments" link from the admin bar
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_disable_comments_admin_bar_menu() {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('comments');
}
add_action('wp_before_admin_bar_render', 'kindling_disable_comments_admin_bar_menu');

/**
 * Close any open comments
 *
 * @since 3.0.0
 *
 * @return void
 */
function kindling_disable_comments_status() {
    return false;
}
add_filter('comments_open', 'kindling_disable_comments_status', 20, 2);
add_filter('pings_open', 'kindling_disable_comments_status', 20, 2);

/**
 * Hide any existing comments
 *
 * @since 3.0.0
 *
 * @return array
 */
function kindling_disable_comments_hide_existing_comments($comments) {
    $comments = array();
    return $comments;
}
add_filter('comments_array', 'kindling_disable_comments_hide_existing_comments', 10, 2);
