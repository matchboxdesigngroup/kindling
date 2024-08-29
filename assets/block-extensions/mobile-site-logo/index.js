import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { MediaUpload } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { registerBlockType } from '@wordpress/blocks';

addFilter(
  'blocks.registerBlockType',
  'kindling/add-second-site-logo',
  (settings, name) => {
    if (name !== 'core/site-logo') {
      return settings;
    }

    const { attributes, edit } = settings;

    attributes.logo2 = {
      type: 'integer',
    };

    settings.edit = (props) => {
      const { setAttributes } = props;
      const logo2 = props.attributes.logo2;

      const onSelectLogo2 = (media) => {
        setAttributes({ logo2: media.id });
      };

      return (
        <div>
          {edit(props)}
          <div>
            <MediaUpload
              onSelect={onSelectLogo2}
              allowedTypes={['image']}
              value={logo2}
              render={({ open }) => (
                <Button onClick={open}>
                  Select Logo For Mobile
                </Button>
              )}
            />
          </div>
        </div>
      );
    };

    return settings;
  }
);
