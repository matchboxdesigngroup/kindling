import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

// Specify allowed blocks to which the attributes should be added
const allowedBlocks = [
  'core/group',
  'core/column',
  'core/cover',
  'core/paragraph',
  'core/heading',
  'core/buttons',
  'core/image',
  'core/post-date',
  'core/post-excerpt',
  'core/post-title',
  'core/post-featured-image',
  'core/post-content',
  'core/post-template'
];

// Custom attributes to add to blocks
const addAttributes = (settings) => {
  // Ensure the settings are valid and match allowed blocks
  if (settings && allowedBlocks.includes(settings.name)) {
    settings.attributes = {
      ...settings.attributes,
      animation: {
        type: 'string',
        default: '',
      },
      aosDuration: {
        type: 'number',
        default: 1000,
      },
      aosDelay: {
        type: 'number',
        default: 0,
      },
      aosEasing: {
        type: 'string',
        default: 'ease',
      },
    };
  }
  return settings;
};

// Extend the block edit component to include custom settings
const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (allowedBlocks.includes(props.name)) {
      const { attributes, setAttributes } = props;
      return (
        <>
          <BlockEdit {...props} />
          <InspectorControls>
            <PanelBody title={__('Animation Settings', 'kindling')} initialOpen={true}>
              <SelectControl
                label={__('Select Animation', 'kindling')}
                value={attributes.animation}
                options={[
                  { label: __('None', 'kindling'), value: '' },
                  { label: __('Fade', 'kindling'), value: 'fade' },
                  { label: __('Fade Up', 'kindling'), value: 'fade-up' },
                  { label: __('Fade Down', 'kindling'), value: 'fade-down' },
                  { label: __('Fade Left', 'kindling'), value: 'fade-left' },
                  { label: __('Fade Right', 'kindling'), value: 'fade-right' },
                  { label: __('Fade Up Right', 'kindling'), value: 'fade-up-right' },
                  { label: __('Fade Up Left', 'kindling'), value: 'fade-up-left' },
                  { label: __('Fade Down Right', 'kindling'), value: 'fade-down-right' },
                  { label: __('Fade Down Left', 'kindling'), value: 'fade-down-left' },
                  { label: __('Flip Up', 'kindling'), value: 'flip-up' },
                  { label: __('Flip Down', 'kindling'), value: 'flip-down' },
                  { label: __('Flip Left', 'kindling'), value: 'flip-left' },
                  { label: __('Flip Right', 'kindling'), value: 'flip-right' },
                  { label: __('Slide Up', 'kindling'), value: 'slide-up' },
                  { label: __('Slide Down', 'kindling'), value: 'slide-down' },
                  { label: __('Slide Left', 'kindling'), value: 'slide-left' },
                  { label: __('Slide Right', 'kindling'), value: 'slide-right' },
                  { label: __('Zoom In', 'kindling'), value: 'zoom-in' },
                  { label: __('Zoom In Up', 'kindling'), value: 'zoom-in-up' },
                  { label: __('Zoom In Down', 'kindling'), value: 'zoom-in-down' },
                  { label: __('Zoom In Left', 'kindling'), value: 'zoom-in-left' },
                  { label: __('Zoom In Right', 'kindling'), value: 'zoom-in-right' },
                  { label: __('Zoom Out', 'kindling'), value: 'zoom-out' },
                  { label: __('Zoom Out Up', 'kindling'), value: 'zoom-out-up' },
                  { label: __('Zoom Out Down', 'kindling'), value: 'zoom-out-down' },
                  { label: __('Zoom Out Left', 'kindling'), value: 'zoom-out-left' },
                  { label: __('Zoom Out Right', 'kindling'), value: 'zoom-out-right' },
                ]}
                onChange={(animation) => setAttributes({ animation })}
              />
              <SelectControl
                label={__('Easing', 'kindling')}
                value={attributes.aosEasing}
                options={[
                  { label: __('Ease', 'kindling'), value: 'ease' },
                  { label: __('Ease In', 'kindling'), value: 'ease-in' },
                  { label: __('Ease Out', 'kindling'), value: 'ease-out' },
                  { label: __('Ease In Out', 'kindling'), value: 'ease-in-out' },
                  { label: __('Linear', 'kindling'), value: 'linear' },
                ]}
                onChange={(aosEasing) => setAttributes({ aosEasing })}
              />
              <RangeControl
                label={__('Duration (ms)', 'kindling')}
                value={attributes.aosDuration}
                onChange={(aosDuration) => setAttributes({ aosDuration })}
                min={0}
                max={5000}
              />
              <RangeControl
                label={__('Delay (ms)', 'kindling')}
                value={attributes.aosDelay}
                onChange={(aosDelay) => setAttributes({ aosDelay })}
                min={0}
                max={5000}
              />
            </PanelBody>
          </InspectorControls>
        </>
      );
    }

    return <BlockEdit {...props} />;
  };
}, 'withInspectorControls');

// Add custom data attributes to the block's save element only when necessary
const addSaveDataAttribute = (extraProps, blockType, attributes) => {
  // Check if the block type is allowed and attributes exist
  if (allowedBlocks.includes(blockType.name) && attributes) {
    // Add animation attributes only if 'animation' is set (not empty)
    if (attributes.animation) {
      extraProps['data-aos'] = attributes.animation;

      // Only add other AOS attributes if 'animation' is not empty
      if (attributes.aosDuration) {
        extraProps['data-aos-duration'] = attributes.aosDuration;
      }
      if (attributes.aosDelay) {
        extraProps['data-aos-delay'] = attributes.aosDelay;
      }
      if (attributes.aosEasing) {
        extraProps['data-aos-easing'] = attributes.aosEasing;
      }
    }
  }

  return extraProps;
};

// Register filters
addFilter('blocks.registerBlockType', 'kindling/add-animation-attribute', addAttributes);
addFilter('editor.BlockEdit', 'kindling/with-inspector-control', withInspectorControls);
addFilter('blocks.getSaveContent.extraProps', 'kindling/add-save-data-attribute', addSaveDataAttribute);
