import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, RangeControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

// Check if the extension should be enabled
if (typeof mobileSiteLogoEnabled !== 'undefined' && mobileSiteLogoEnabled) {
  addFilter(
    'blocks.registerBlockType',
    'kindling/mobile-site-logo',
    (settings, name) => {
      if (name !== 'core/site-logo') {
        return settings;
      }

      const { attributes, edit } = settings;

      // Add new attributes for the mobile logo and its width
      attributes.logo2 = {
        type: 'integer',
      };

      attributes.mobileLogoWidth = {
        type: 'number',
        default: 50, // Default width in pixels
      };

      // Modify the block's edit function
      settings.edit = (props) => {
        const { setAttributes, attributes } = props;
        const { logo2, mobileLogoWidth } = attributes;
        const blockProps = useBlockProps();

        // Handler for selecting the mobile logo
        const onSelectLogo2 = (media) => {
          setAttributes({ logo2: media.id });
        };

        // Handler for changing the mobile logo width
        const onChangeLogoWidth = (value) => {
          setAttributes({ mobileLogoWidth: value });
        };

        // Fetch the URL of the selected mobile logo to render it
        const mobileLogoUrl = logo2 ? wp.data.select('core').getMedia(logo2)?.source_url : '';

        return (
          <Fragment>
            <div {...blockProps}>
              <div className="components-resizable-box__container">
                <a href="#" className="wp-block-site-logo__link">
                  {/* Existing desktop logo */}
                  {edit(props)}
                  {/* Mobile logo, hidden on desktop by CSS */}
                  {mobileLogoUrl && (
                    <img
                      src={mobileLogoUrl}
                      alt={__('Mobile Logo', 'kindling')}
                      className="wp-block-site-logo__image wp-block-site-logo--mobile"
                      style={{ minWidth: `${mobileLogoWidth}px` }} // Apply inline style for width
                    />
                  )}
                </a>
              </div>
            </div>
            <InspectorControls>
              <PanelBody title={__('Mobile Logo Settings', 'kindling')} initialOpen={true}>
                <MediaUpload
                  onSelect={onSelectLogo2}
                  allowedTypes={['image']}
                  value={logo2}
                  render={({ open }) => (
                    <div style={{ marginBottom: '16px' }}>
                    <Button onClick={open} isSecondary>
                      {logo2 ? __('Replace Mobile Logo', 'kindling') : __('Select Mobile Logo', 'kindling')}
                    </Button>
                    </div>
                  )}
                />
                {/* Image Width Control */}
                <div style={{ marginBottom: '16px' }}>
                  <RangeControl
                    label={__('Mobile Logo Width (px)', 'kindling')}
                    value={mobileLogoWidth}
                    onChange={onChangeLogoWidth}
                    min={10} // Set the minimum value for the slider
                    max={200} // Set the maximum value for the slider
                    step={10} // Set the step size for the slider
                  />
                </div>
              </PanelBody>
            </InspectorControls>
          </Fragment>
        );
      };

      return settings;
    }
  );
}
