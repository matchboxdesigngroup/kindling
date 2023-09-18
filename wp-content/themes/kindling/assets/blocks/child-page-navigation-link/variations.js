/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { next, previous } from '@wordpress/icons';

const variations = [
	{
		isDefault: true,
		name: 'page-next',
		title: __( 'Next child page' ),
		description: __(
			'Displays the child page link that follows the current child page.'
		),
		icon: next,
		attributes: { type: 'next' },
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'page-previous',
		title: __( 'Previous child page' ),
		description: __(
			'Displays the child page link that precedes the current child page.'
		),
		icon: previous,
		attributes: { type: 'previous' },
		scope: [ 'inserter', 'transform' ],
	},
];

/**
 * Add `isActive` function to all `child-page-navigation-link` variations, if not defined.
 * `isActive` function is used to find a variation match from a created
 *  Block by providing its attributes.
 */
variations.forEach( ( variation ) => {
	if ( variation.isActive ) return;
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.type === variationAttributes.type;
} );

export default variations;
