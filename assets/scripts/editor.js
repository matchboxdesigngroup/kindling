import domReady from '@wordpress/dom-ready';
import { unregisterBlockStyle } from '@wordpress/blocks';

/**
 * Editor Styles.
 */
import '../styles/editor.scss';

/**
 * Custom Blocks.
 */
import '../blocks/publications-taxonomy-terms-list';
import '../blocks/search-icon';

/**
 * Enable Grid Support
 */
import '../block-extensions/grid-variation/grid-variation';

/**
 * Mobile Site Logo
 * Filter the existing Site Logo block and add additional image
 */
import '../block-extensions/mobile-site-logo';

/**
  * Import box-shadow feature.
  * A series of radio buttons appear in the editor for the Group block
  * and the options add css classes to manage box-shadow styles.
  */
import '../block-extensions/box-shadow';

/**
 * Link underline
 * Add link no underline option
 */
import '../block-extensions/link-underline';

/**
 * Safe SVG extension - Add color selection controls
 */
import '../block-extensions/safe-svg';

/**
 * Block links.
 * Adds link option to group, column, and cover blocks.
 */
import '../block-extensions/block-toolbar/block-links';

/**
 * Unregister two block styles for the 'core/button' block type when the DOM is ready.
 *
 * @name domReady
 * @param {function} callback - A callback function to execute when the DOM is ready.
 * @returns {void}
 */
domReady(function () {
  unregisterBlockStyle('core/button', 'outline');
  unregisterBlockStyle('core/button', 'fill');
});
