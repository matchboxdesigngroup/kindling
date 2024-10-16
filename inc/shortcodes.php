<?php

/* Shortcode to display year [current_year] */
function kindling_current_year_shortcode()
{
  date_default_timezone_set('America/Chicago');
  return date('Y');
}
add_shortcode('current_year', 'kindling_current_year_shortcode');
