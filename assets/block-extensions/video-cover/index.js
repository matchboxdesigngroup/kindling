import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Add custom attributes to the core Cover block
const addVideoCoverAttributes = (settings, name) => {
    if (name !== 'core/cover') {
        return settings;
    }

    // Extend attributes to include video URL
    settings.attributes = {
        ...settings.attributes,
        videoUrl: {
            type: 'string',
            default: ''
        }
    };

    return settings;
};

addFilter(
    'blocks.registerBlockType',
    'kindling/extend-cover-block',
    addVideoCoverAttributes
);

// Add custom controls to the Inspector for the core Cover block
const withVideoCoverControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes, name } = props;
        const { videoUrl = '' } = attributes;

        if (name !== 'core/cover') {
            return <BlockEdit {...props} />;
        }

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title={__('Video Background Settings', 'kindling')}>
                        <TextControl
                            label={__('Youtube Video URL', 'kindling')}
                            value={videoUrl}
                            onChange={(newUrl) => setAttributes({ videoUrl: newUrl })}
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withVideoCoverControls');

addFilter(
    'editor.BlockEdit',
    'kindling/with-video-cover-controls',
    withVideoCoverControls
);
