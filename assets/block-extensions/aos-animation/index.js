import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

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
            <PanelBody title="Animation Settings" initialOpen={true}>
              <SelectControl
                label="Select Animation"
                value={attributes.animation}
                options={[
                  { label: 'None', value: '' },
                  { label: 'Fade', value: 'fade' },
                  { label: 'Fade Up', value: 'fade-up' },
                  { label: 'Fade Down', value: 'fade-down' },
                  { label: 'Fade Left', value: 'fade-left' },
                  { label: 'Fade Right', value: 'fade-right' },
                  { label: 'Fade Up Right', value: 'fade-up-right' },
                  { label: 'Fade Up Left', value: 'fade-up-left' },
                  { label: 'Fade Down Right', value: 'fade-down-right' },
                  { label: 'Fade Down Left', value: 'fade-down-left' },
                  { label: 'Flip Up', value: 'flip-up' },
                  { label: 'Flip Down', value: 'flip-down' },
                  { label: 'Flip Left', value: 'flip-left' },
                  { label: 'Flip Right', value: 'flip-right' },
                  { label: 'Slide Up', value: 'slide-up' },
                  { label: 'Slide Down', value: 'slide-down' },
                  { label: 'Slide Left', value: 'slide-left' },
                  { label: 'Slide Right', value: 'slide-right' },
                  { label: 'Zoom In', value: 'zoom-in' },
                  { label: 'Zoom In Up', value: 'zoom-in-up' },
                  { label: 'Zoom In Down', value: 'zoom-in-down' },
                  { label: 'Zoom In Left', value: 'zoom-in-left' },
                  { label: 'Zoom In Right', value: 'zoom-in-right' },
                  { label: 'Zoom Out', value: 'zoom-out' },
                  { label: 'Zoom Out Up', value: 'zoom-out-up' },
                  { label: 'Zoom Out Down', value: 'zoom-out-down' },
                  { label: 'Zoom Out Left', value: 'zoom-out-left' },
                  { label: 'Zoom Out Right', value: 'zoom-out-right' }
                ]}
                onChange={(animation) => setAttributes({ animation })}
              />
              <SelectControl
                label="Easing"
                value={attributes.aosEasing}
                options={[
                  { label: 'Ease', value: 'ease' },
                  { label: 'Ease In', value: 'ease-in' },
                  { label: 'Ease Out', value: 'ease-out' },
                  { label: 'Ease In Out', value: 'ease-in-out' },
                  { label: 'Linear', value: 'linear' },
                ]}
                onChange={(aosEasing) => setAttributes({ aosEasing })}
              />
              <RangeControl
                label="Duration (ms)"
                value={attributes.aosDuration}
                onChange={(aosDuration) => setAttributes({ aosDuration })}
                min={0}
                max={5000}
              />
              <RangeControl
                label="Delay (ms)"
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
