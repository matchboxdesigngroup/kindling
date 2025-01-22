/**
 * WordPress Dependencies
 */
const { createHigherOrderComponent } = wp.compose;
const { __ } = wp.i18n;

// Create a higher order component to wrap the existing block.
// eslint-disable-next-line no-unused-vars
const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    // eslint-disable-next-line no-unused-vars
    const { Fragment } = wp.element;
    // eslint-disable-next-line no-unused-vars
    const { InspectorControls } = wp.blockEditor;
    // eslint-disable-next-line no-unused-vars
    const { PanelBody, ToggleControl } = wp.components;

    // Only add the new control if the block is a paragraph block.
    if (props.name !== 'core/paragraph') {
      return <BlockEdit {...props} />;
    }

    const { className = '' } = props.attributes;
    const removeUnderline = className.split(' ').includes('no-link-underline');

    // Add a new toggle control to the block's inspector controls.
    return (
      <Fragment>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody title={__('Additional Settings', 'kindling')} initialOpen={true}>
            <ToggleControl
              label={__('Remove links underline', 'kindling')}
              checked={removeUnderline}
              onChange={(newVal) => {
                const newClassName = newVal
                  ? `${className} no-link-underline`
                  : className.replace('no-link-underline', '');
                props.setAttributes({ className: newClassName.trim() });
              }}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  };
}, 'withInspectorControl');

wp.hooks.addFilter(
  'editor.BlockEdit',
  'kindling/remove-link-underline',
  withInspectorControls
);
