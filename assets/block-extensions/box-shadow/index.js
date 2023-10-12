/* eslint-disable no-unused-vars */

/**
 * WordPress Dependencies
 */
import { Fragment, useState } from '@wordpress/element';
import { RadioControl } from '@wordpress/components';
import { InspectorAdvancedControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

const blocksWithBoxShadow = [ 'core/group', 'core/column', 'core/cover' ];

/**
 * Adds a box shadow custom attribute to the settings object for the 'core/group' block type.
 *
 * @function
 * @name addShadowAttribute
 * @param {Object} settings - The settings object for the block type.
 * @param {string} name - The name of the block type.
 * @returns {Object} The updated settings object.
 *
 */
export function addShadowAttribute(settings, name) {
  if (typeof settings.attributes !== 'undefined') {
    if ( blocksWithBoxShadow.includes( settings.name ) ) {
      settings.attributes = Object.assign(settings.attributes, {
        boxShadow: {
          type: 'string',
          default: 'none',
        },
      });
    }
  }
  return settings;
}

addFilter(
  'blocks.registerBlockType',
  'kindling/shadow-custom-attribute',
  addShadowAttribute
);

/**
 * (Create attribute and add radio buttons in editor advanced controls)
 * Filter block editor of Group block and add a Radio Control named Box Shadow to the Advanced controls.
 */
export const shadowAdvancedControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    // Custom attibute.
    const { attributes: { boxShadow }, setAttributes, isSelected } = props;

    return (
      <Fragment>
        <BlockEdit {...props} />
        {isSelected && (blocksWithBoxShadow.includes( props.name )) &&
          <InspectorAdvancedControls>
            <RadioControl
              label="Box Shadow"
              help="The size of the box shadow"
              selected={ boxShadow }
              options={[
                { label: 'None', value: 'none' },
                { label: 'X-Small', value: 'xs' },
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'large' },
              ] }
              onChange={(value) => setAttributes({ boxShadow: String(value) }) }
            />
          </InspectorAdvancedControls>
        }
      </Fragment>
    );
  };
}, 'shadowAdvancedControls');

addFilter(
  'editor.BlockEdit',
  'kindling/shadow-advanced-control',
  shadowAdvancedControls
);

/**
  * Applies an extra class to a block's save content (frontend) based on the block type and attributes.
  * @param {Object} extraProps - The extra properties to add to the block's save content.
  * @param {Object} blockType - The type of the block.
  * @param {Object} attributes - The attributes of the block.
  * @returns {Object} The updated extraProps object with the custom class if the block is a core/group block and has a custom box shadow.
 */
export function frontendAddCustomBlockClass(extraProps, settings, attributes) {
  const { boxShadow } = attributes;

  // If the block is not a core/group block, return the original extraProps
  if( ! blocksWithBoxShadow.includes( settings.name ) ) {
    return extraProps;
  }

  // If the block has a custom box shadow, add the corresponding custom class to the extraProps className property.
  if (boxShadow && boxShadow !== 'undefined' && boxShadow !== 'none') {
    extraProps.className = extraProps.className + ' has-custom-box-shadow--' + boxShadow;
  }

  return extraProps;
}

addFilter(
  'blocks.getSaveContent.extraProps',
  'kindling/shadow-apply-class',
  frontendAddCustomBlockClass
);

/**
 * A higher-order component that (conditionally) adds the box shadow custom class to a block element
 * in the editor if it is a group block and has the boxShadow attribute.
 *
 * @param {Function} BlockListBlock - The original BlockListBlock component.
 * @returns {Function} A new component that conditionally adds a custom class to the block element.
 */
export const editorAddCustomBlockClass = createHigherOrderComponent((BlockListBlock) => {
  return (props) => {
    const { name, attributes } = props;

    if ( ! blocksWithBoxShadow.includes( name ) ) {
      return <BlockListBlock {...props} />;
    }

    const { boxShadow } = attributes;
    const customClass = boxShadow !== 'none' ? ' has-custom-box-shadow--' + boxShadow : '';

    return <BlockListBlock {...props} className={customClass} />;
  };
}, 'editorAddCustomBlockClass');

addFilter(
  'editor.BlockListBlock',
  'kindling/editor-add-shadow-class',
  editorAddCustomBlockClass
);
