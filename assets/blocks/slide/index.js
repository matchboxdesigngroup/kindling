/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import Save from './save';

// Export this so we can use it in the edit and save files
export const innerBlocksTemplate = [
  [ 'kindling/slide-block', { placeholder: 'Enter slide content...' } ],
];

// Register the block
registerBlockType( metadata.name, {
  title: metadata.title,
	edit: Edit,
	save: Save,
} );
