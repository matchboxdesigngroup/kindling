<?php

/**
 * Mobile Site Logo block extension render
 */
function add_mobile_logo_attribute($args, $block_name)
{
  if ($block_name === 'core/site-logo') {
    // Add the custom attributes for the mobile logo and its width
    $args['attributes']['logo2'] = array(
      'type' => 'integer',
    );
    $args['attributes']['mobileLogoWidth'] = array(
      'type' => 'number',
      'default' => 100, // Default width in pixels
    );
  }
  return $args;
}
add_filter('register_block_type_args', 'add_mobile_logo_attribute', 10, 2);

function render_mobile_logo($block_content, $block)
{
  // Retrieve the custom options to check if the mobile logo feature is enabled
  $options = get_option('kindling_options');
  // dd($options);

  // Check if the mobile logo feature is enabled in the options settings
  if (empty($options['kindling_mobile_site_logo_checkbox'])) {
    $block_content = str_replace(
      'wp-block-site-logo', // Target the existing class of the logo link
      'wp-block-site-logo wp-block-site-logo--mobile-disabled', // Add a new class when mobile logo is disabled
      $block_content
    );

    // Return the modified block content without adding the mobile logo
    return $block_content;
  }

  // Check if the block is the Site Logo block and the mobile logo is set
  if ($block['blockName'] === 'core/site-logo' && !empty($block['attrs']['logo2'])) {
    // Get the mobile logo width or set a default if not defined
    $mobile_logo_width = !empty($block['attrs']['mobileLogoWidth']) ? $block['attrs']['mobileLogoWidth'] : 100;

    // Get the mobile logo image
    $mobile_image = wp_get_attachment_image($block['attrs']['logo2'], 'full', false, array(
      'class' => 'custom-logo',
      'style' => 'max-width: ' . esc_attr($mobile_logo_width) . 'px;' // Apply the width as inline style
    ));

    // Add the mobile logo to the block content
    $block_content .= '<div class="is-style-default wp-block-site-logo wp-block-site-logo--mobile">';
    $block_content .= '<a href="' . esc_url(home_url('/')) . '" class="custom-logo-link custom-logo-link--mobile" rel="home" aria-current="page">' . $mobile_image . '</a>';
    $block_content .= '</div>';
  }
  return $block_content;
}
add_filter('render_block', 'render_mobile_logo', 10, 2);
