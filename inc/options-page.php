<?php
// Register the theme options page
function kindling_add_admin_menu()
{
  add_menu_page(
    'Theme Options',            // Page title
    'Theme Options',            // Menu title
    'manage_options',           // Capability
    'kindling_options',         // Menu slug
    'kindling_options_page',    // Callback function
    'dashicons-admin-generic',  // Icon
    60                          // Position
  );
}
add_action('admin_menu', 'kindling_add_admin_menu');

// Display the theme options page content
function kindling_options_page()
{
?>
  <div class="wrap">
    <h1>Theme Options</h1>
    <form method="post" action="options.php">
      <?php
      settings_fields('kindling_options_group');
      do_settings_sections('kindling_options');
      submit_button();
      ?>
    </form>
  </div>
<?php
}

// Register settings, sections, and fields
function kindling_settings_init()
{
  register_setting('kindling_options_group', 'kindling_options', array(
    'type' => 'array',
    // 'sanitize_callback' => 'kindling_sanitize_options', // Optional: add a sanitize callback
  ));

  add_settings_section(
    'kindling_section',             // ID
    'Kindling Theme Options',       // Title
    'kindling_section_callback',    // Callback
    'kindling_options'              // Page
  );

  add_settings_field(
    'kindling_mobile_site_logo_checkbox',            // ID
    'Enable Mobile Logo Extension',                  // Title
    'kindling_mobile_site_logo_checkbox_callback',   // Callback
    'kindling_options',                              // Page
    'kindling_section'                               // Section
  );
}
add_action('admin_init', 'kindling_settings_init');

// Optional sanitize callback for settings
// function kindling_sanitize_options($options)
// {
//   // Sanitize checkbox value
//   $options['kindling_mobile_site_logo_checkbox'] = isset($options['kindling_mobile_site_logo_checkbox']) ? 1 : 0;
//   return $options;
// }

// Section callback function
function kindling_section_callback()
{
  echo '<p>Manage theme settings.</p>';
}

// Checkbox callback function
function kindling_mobile_site_logo_checkbox_callback()
{
  $options = get_option('kindling_options', array());
  $checked = isset($options['kindling_mobile_site_logo_checkbox']) ? 'checked' : '';
  echo '<input type="checkbox" id="kindling-mobile-site-logo-checkbox" name="kindling_options[kindling_mobile_site_logo_checkbox]" value="1" ' . $checked . ' />';
}

// Add inline script to toggle block extension settings based on the options page setting
function kindling_options_enqueue_block_editor_assets()
{
  $options = get_option('kindling_options', array()); // Ensure it returns an array
  $is_mobile_site_logo_enabled = isset($options['kindling_mobile_site_logo_checkbox']) ? 'true' : 'false';

  wp_add_inline_script(
    'kindling/mobile-site-logo', // The handle of your block extension script
    "const mobileSiteLogoEnabled = {$is_mobile_site_logo_enabled};",
    'before'
  );
}
add_action('enqueue_block_editor_assets', 'kindling_options_enqueue_block_editor_assets');
