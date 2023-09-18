/* eslint-disable no-unused-vars */

/**
 * Extend the Safe SVG block to add a custom color selection feature
 * https://github.com/10up/safe-svg
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { ColorPalette, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

function addIconColorAttribute(settings, name) {
  if (name !== 'safe-svg/svg-icon') { // Replace with the actual block name
    return settings;
  }

  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      iconColor: {
        type: 'string',
        default: '',
      },
    },
  };
}

addFilter('blocks.registerBlockType', 'kindling/add-icon-color-attribute', addIconColorAttribute);

const addSafeSvgCustomColorInspectorControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (props.name !== 'safe-svg/svg-icon') { // Replace with the actual block name
      return <BlockEdit {...props} />;
    }

    const { attributes, setAttributes } = props;

    return (
      <>
        <div style={{ color: attributes.iconColor }}>
          <BlockEdit {...props} />
        </div>
        <InspectorControls>
          <PanelBody title={ 'Icon Color' }>
          <ColorPalette
            value={ attributes.iconColor }
            onChange={ (newColor) => {
              if (newColor) {
                  setAttributes({ iconColor: newColor });
              } else {
                setAttributes({ iconColor: 'none' });
              }
            }}
          />
          </PanelBody>
        </InspectorControls>
      </>
    );
  };
}, 'addSafeSvgCustomColorInspectorControls');

addFilter(
  'editor.BlockEdit',
  'kindling/safe-svg-add-custom-color-control',
  addSafeSvgCustomColorInspectorControls
);

function addSafeSvgCustomWrapperStyle(extraProps, blockType, attributes) {
  if (blockType.name !== 'safe-svg/svg-icon') { // Replace with the actual block name
    return extraProps;
  }

  // Only add the inline style if iconColor is set and not 'none'
  if (attributes.iconColor && attributes.iconColor !== 'none') {
    extraProps.style = { ...extraProps.style, color: attributes.iconColor };
  }

  return extraProps;
}

addFilter('blocks.getSaveContent.extraProps', 'kindling/add-custom-wrapper-style', addSafeSvgCustomWrapperStyle);
