/* eslint-disable no-unused-vars */
// TODO: kill this extension if editorskit plugin is activated
// TODO: add credits to editorskit

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, RichTextToolbarButton, URLInput } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import { cloneBlock } from '@wordpress/blocks';
import { PanelBody, TextControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';

import LinkToolbar from './components/controls';

const blocksWithLinkToolbar = [
  'core/group',
  'core/column',
  'core/cover',
  'safe-svg/svg-icon',
];

/**
 * Filters registered block settings, adding attributes for links
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttributes( settings ) {
  if ( typeof settings.attributes !== 'undefined' ) {
    if ( blocksWithLinkToolbar.includes( settings.name ) ) {
      if ( typeof settings.attributes !== 'undefined' ) {
        settings.attributes = Object.assign( settings.attributes, {
          href: {
            type: 'string',
          },
          linkDestination: {
            type: 'string',
            default: 'none',
          },
          opensInNewTab: {
            type: 'boolean',
            default: false,
          },
          linkNoFollow: {
            type: 'boolean',
            default: false,
          },
          linkSponsored: {
            type: 'boolean',
            default: false,
          },
          ariaLabel: {
            type: 'string',
            default: '',
          },
        } );
      }
    }
  }
  return settings;
}

/**
 * Override props assigned to save component to inject atttributes
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
function applyExtraClass( extraProps, blockType, attributes ) {
  const { href } = attributes;

  if (
    ( blocksWithLinkToolbar.includes( blockType.name ) ) &&
		typeof href !== 'undefined' &&
		href
	) {
		extraProps.className = classnames( extraProps.className, 'kindling-linked-block' );
  }

  return extraProps;
}

addFilter(
	'blocks.registerBlockType',
	'kindling/custom/attributes',
	addAttributes
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'kindling/applyExtraClass',
	applyExtraClass
);

/**
 * Override the default edit UI to include a new block toolbar control
 *
 * @param {Function} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withLinkToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		return (
			<Fragment>
				<BlockEdit { ...props } />
				{ props.isSelected && ( blocksWithLinkToolbar.includes( props.name ) ) && <LinkToolbar { ...{ ...props } } /> }
			</Fragment>
		);
	};
}, 'withLinkToolbar' );

addFilter(
	'editor.BlockEdit',
	'kindling/block-link-toolbar',
	withLinkToolbar
);
