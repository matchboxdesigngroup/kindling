/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import Save from './save';

// Export this so we can use it in the edit and save files
export const innerBlocksTemplate = [
  [ 'kindling/slide-block', { placeholder: __( 'Enter slide content...', 'kindling' ) } ],
];

// Register the block
registerBlockType( metadata.name, {
  title: metadata.title,
	edit: Edit,
	save: Save,
} );
