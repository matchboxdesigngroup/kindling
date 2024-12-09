<?php
function kindling_register_cover_block_attributes()
{
  // Get the existing block type
  $block_type = WP_Block_Type_Registry::get_instance()->get_registered('core/cover');
  if (! $block_type) {
    return;
  }

  // Add the 'videoUrl' attribute if it doesn't already exist
  if (! isset($block_type->attributes['videoUrl'])) {
    $block_type->attributes['videoUrl'] = array(
      'type' => 'string',
      'default' => '',
    );
  }
}
add_action('init', 'kindling_register_cover_block_attributes');

function kindling_modify_cover_block_output($block_content, $block)
{
  if (!is_array($block) || !isset($block['blockName'])) {
    return $block_content;
  }

  if ($block['blockName'] !== 'core/cover') {
    return $block_content;
  }

  $attributes = $block['attrs'] ?? [];

  if (!empty($attributes['videoUrl'])) {
    $video_url = esc_url_raw($attributes['videoUrl']);
    $youtube_id = kindling_get_youtube_id($video_url);

    if ($youtube_id) {
      // Construct the YouTube embed URL.
      $embed_url = 'https://www.youtube.com/embed/' . $youtube_id . '?autoplay=1&loop=1&mute=1&playlist=' . $youtube_id . '&controls=0&showinfo=0&modestbranding=1&rel=0';

      // Create the iframe.
      $video_element = sprintf(
        '<iframe src="%s" frameborder="0" allow="autoplay; loop; fullscreen" allowfullscreen class="wp-block-cover__video-background" style="pointer-events:none;"></iframe>',
        esc_url($embed_url)
      );

      // Move the video element to be directly inside the wp-block-cover.
      $block_content = preg_replace(
        '/(<span[^>]*class="wp-block-cover__background[^"]*"[^>]*>.*?<\/span>)/s',
        '$1' . $video_element,
        $block_content,
        1
      );
    }
  }

  return $block_content;
}

add_filter('render_block', 'kindling_modify_cover_block_output', 10, 2);


// Helper function to extract YouTube video ID from URL
function kindling_get_youtube_id($url)
{
  if (preg_match('/youtu\.be\/([^\?\/]+)/', $url, $matches)) {
    return $matches[1];
  } elseif (preg_match('/youtube\.com.*v=([^\&]+)/', $url, $matches)) {
    return $matches[1];
  } elseif (preg_match('/youtube\.com\/embed\/([^\?\/]+)/', $url, $matches)) {
    return $matches[1];
  } elseif (preg_match('/youtube\.com\/v\/([^\?\/]+)/', $url, $matches)) {
    return $matches[1];
  }
  return false;
}
