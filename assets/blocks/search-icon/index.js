/* eslint-disable no-unused-vars */

// based on core/social-links - https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/social-links/edit.js

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';
import { ColorPalette, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, Toolbar, ToolbarGroup, ToolbarDropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';

registerBlockType('kindling/custom-search-link', {
  title: __( 'Search Link', 'kindling' ),
  icon: 'search',
  category: 'design',

  attributes: {
    iconColor: {
      type: 'string',
      default: '#000000',
    },
    iconSize: {
      type: 'string',
      default: 'medium',
    },
  },

  edit({ attributes, setAttributes }) {
    const { iconColor, iconSize } = attributes;

    const iconSizes = [
      {
          name: 'small',
          title: __('Small', 'kindling'),
          sizeClass: 'has-small-icon-size',
      },
      {
          name: 'medium',
          title: __('Medium', 'kindling'),
          sizeClass: 'has-medium-icon-size',
      },
      {
          name: 'large',
          title: __('Large', 'kindling'),
          sizeClass: 'has-large-icon-size',
      },
      {
          name: 'huge',
          title: __('Huge', 'kindling'),
          sizeClass: 'has-huge-icon-size',
      },
    ];

    return (
      <>
        <BlockControls>
        <ToolbarGroup>
          <ToolbarDropdownMenu
              label={__('Size', 'kindling')}
              text={__('Size', 'kindling')}
              icon={null}
          >
            { ({ onClose }) => (
                <MenuGroup>
                  {iconSizes.map((sizeOption) => {
                    return (
                      <MenuItem
                        icon={iconSize === sizeOption.name && check}
                        isSelected={iconSize === sizeOption.name}
                        key={sizeOption.name}
                        onClick={() => {
                            setAttributes({ iconSize: sizeOption.name });
                            onClose();
                        }}
                        role="menuitemradio"
                      >
                        {sizeOption.title}
                      </MenuItem>
                    );
                  })}
                </MenuGroup>
              )}
            </ToolbarDropdownMenu>
          </ToolbarGroup>
        </BlockControls>
        <InspectorControls>
          <PanelBody title={ __('Icon Color', 'kindling') }>
            <ColorPalette
              value={ iconColor }
              onChange={ (newColor) => setAttributes({ iconColor: newColor }) }
            />
          </PanelBody>
        </InspectorControls>

        <div className={`kindling-search-link has-${iconSize}-icon-size`} onClick={ ( event ) => {
            event.preventDefault();
            event.stopPropagation();
        }}>
          <a href="/?s=" aria-label="search" className='kindling-search-link__link' style={{ color: iconColor }}>
            {/* <span className="dashicons dashicons-search" style={{ color: iconColor }}></span> */}
            <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Icons/search">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
            </svg>
          </a>
        </div>
      </>
    );
  },

  save({ attributes }) {
    const { iconColor, iconSize } = attributes;

    return (
      <div className={`kindling-search-link has-${iconSize}-icon-size`}>
        <a href="/?s=" aria-label="search" className='kindling-search-link__link' style={{ color: iconColor }}>
          {/* <span className="dashicons dashicons-search" style={{ color: iconColor }}></span> */}
          <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Icons/search">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
          </a>
      </div>
    );
  },
});
