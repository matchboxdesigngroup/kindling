import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const allowedBlocks = ['core/group', 'core/column', 'core/cover'];

// Custom attribute you want to add
const addAttributes = (settings) => {
  if (allowedBlocks.includes(settings.name)) {
    settings.attributes = {
      ...settings.attributes,
      animation: {
        type: 'string',
        default: '',
      },
    };
  }

  return settings;
};

// Extend the block edit component to include your custom settings
const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (allowedBlocks.includes(props.name)) {
      return (
        <>
          <BlockEdit {...props} />
          <InspectorControls>
            <PanelBody title="Animation" initialOpen={true}>
              <SelectControl
                label="Select Animation"
                value={props.attributes.animation}
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
                onChange={(animation) => props.setAttributes({ animation })}
              />
            </PanelBody>
          </InspectorControls>
        </>
      );
    }

    return <BlockEdit {...props} />;
  };
}, 'withInspectorControl');

// Add a filter to inject the 'data-aos' attribute during the save process
const addSaveDataAttribute = (extraProps, blockType, attributes) => {
  if (allowedBlocks.includes(blockType.name) && attributes.animation) {
    extraProps['data-aos'] = attributes.animation;
  }

  return extraProps;
};

// Hook into the block register to add your attributes and extend the edit component
addFilter(
  'blocks.registerBlockType',
  'kindling/add-animation-attribute',
  addAttributes
);

addFilter(
  'editor.BlockEdit',
  'kindling/with-inspector-control',
  withInspectorControls
);

// Hook into the 'getSaveContent.extraProps' filter to add the 'data-aos' attribute to the save output
addFilter(
  'blocks.getSaveContent.extraProps',
  'kindling/add-save-data-attribute',
  addSaveDataAttribute
);
