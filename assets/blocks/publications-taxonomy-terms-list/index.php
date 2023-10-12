<?php

/**
 * Publications Categories Link List block server side render.
 *
 * Renders a list of taxonomy terms for the 'publications' post type
 * and the 'publication-category' taxonomy.
 *
 * @param array $attributes The block attributes.
 * @return string The HTML output for the block.
 */
function render_publications_terms_block($attributes) {
    $taxonomy = 'publication-category'; // Hardcoded taxonomy
    $all_terms = get_terms(array('taxonomy' => $taxonomy, 'hide_empty' => false));

    if (empty($all_terms)) {
        return 'No terms found.';
    }

    // Get the current archive term if on a taxonomy archive page
    $current_archive_term = is_tax($taxonomy) ? get_queried_object() : null;

    // Organize terms into a hierarchical structure
    $terms_tree = array();
    foreach ($all_terms as $term) {
        if ($term->parent == 0) {
            $terms_tree[$term->term_id] = array('term' => $term, 'children' => array());
        }
    }
    foreach ($all_terms as $term) {
        if ($term->parent != 0 && isset($terms_tree[$term->parent])) {
            $terms_tree[$term->parent]['children'][] = $term;
        }
    }

    $output = '<div class="wp-block-kindling-publications-categories-link-list publications-categories-link-list">';
    $output .= '<div class="publications-categories-link-list__responsive">';
    // Desktop
    $output .= '<nav class="mb-20 hidden md:block" aria-label="Publication Categories">';
    $output .= '<ul>';
    foreach ($terms_tree as $parent_term) {
        $output .= render_term($parent_term, $current_archive_term);
    }
    $output .= '</ul>';
    $output .= '</nav>';
    // Mobile
    $output .= '<select class="block md:hidden mb-7">';
    foreach ($terms_tree as $parent_term) {
        $output .= render_term_option($parent_term, $current_archive_term);
    }
    $output .= '</select>';
    $output .= '<div class="h-[1px] w-full mb-6 block md:hidden bg-light-grey"></div>';
    $output .= '</div>';
    $output .= '</div>';

    return $output;
}

function render_term($term_tree, $current_archive_term) {
    $term = $term_tree['term'];
    $term_link = esc_url(get_term_link($term));
    $is_current_term = $current_archive_term && $term->term_id == $current_archive_term->term_id;
    $output = '<li class="' . ($is_current_term ? 'current-cat' : '') . '">';
    $output .= '<a href="' . $term_link . '" onclick="window.location.href=\'' . $term_link . '\'" aria-label="View all publications in ' . esc_html($term->name) . '">' . esc_html($term->name) . '</a>';
    if (!empty($term_tree['children'])) {
        $output .= '<ul class="publication-category-submenu">';
        foreach ($term_tree['children'] as $child_term) {
            $output .= render_term(array('term' => $child_term, 'children' => array()), $current_archive_term);
        }
        $output .= '</ul>';
    }
    $output .= '</li>';
    return $output;
}

function render_term_option($term_tree, $current_archive_term) {
    $term = $term_tree['term'];
    $term_link = esc_url(get_term_link($term));
    $is_current_term = $current_archive_term && $term->term_id == $current_archive_term->term_id;
    $output = '<option value="' . $term_link . '"' . ($is_current_term ? ' selected' : '') . '>';
    $output .= esc_html($term->name);
    $output .= '</option>';
    return $output;
}

register_block_type('kindling/publications-categories-link-list', array(
    'render_callback' => 'render_publications_terms_block',
));
