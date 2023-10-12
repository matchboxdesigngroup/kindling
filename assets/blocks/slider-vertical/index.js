/* eslint-disable no-unused-vars */

/**
 * Kindling Slider Block with Swiper and Slide innerblock
 */

import { registerBlockType, createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
  BlockControls,
  InnerBlocks,
  RichText,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

const TEMPLATE = [
  [ 'kindling/slide-block', { placeholder: 'Enter side content...' } ],
];

registerBlockType( 'kindling/slider-block', {
	title: __( 'Slider', 'kindling-slider-block' ),
  category: 'design',
  supports: {
    multiple: false,
    spacing: {
      margin: true,
      padding: true,
    },
  },
  attributes: {
    textString: {
      type: 'string',
      selector: 'h4',
    },
  },

  edit(props) {
		const blockProps = useBlockProps({
      className: 'wp-block-kindling-slider-block slider-block swiper',
    });

    const { setAttributes, attributes, clientId } = props;

    function onTextChange(changes) {
      setAttributes({
          textString: changes,
      });
    }

    const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );
    const innerBlocks = useSelect(
      ( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
      [ clientId ]
    );

    const addNewSlide = () => {
      const slideBlock = createBlock('kindling/slide-block', {}, [
        createBlock('core/heading', { level: 4, placeholder: 'Enter heading...' }),
        createBlock('core/paragraph', { placeholder: 'Enter text...' }),
        createBlock('core/button', { text: 'Click me' }),
      ]);

      replaceInnerBlocks(clientId, [...innerBlocks, slideBlock], false);
    };

    return (
      <div>
        <BlockControls>
          <ToolbarGroup>
            <ToolbarButton
              icon="plus"
              title="Add Slide"
              onClick={addNewSlide}
              disabled={ ! props.isSelected }
            />
          </ToolbarGroup>
        </BlockControls>
        {/* TODO - make this a heading block instead of a richtext field */}
        {/* <RichText
          tagName="h4"
          value={attributes.textString}
          onChange={onTextChange}
          placeholder="Add a heading"
        /> */}
        <div {...blockProps}>
          <div className='swiper-wrapper'>
            <InnerBlocks
              template={ TEMPLATE }
            />
          </div>
          <div className='slider-block__pagination-wrapper'>
             <RichText
                tagName="h4"
                value={attributes.textString}
                onChange={onTextChange}
                placeholder="Add a heading"
              />
            <div className='slider-block-pagination'></div>
          </div>

          <div className='slider-block__button--prev'></div>
          <div className='slider-block__button--next'></div>
        </div>
      </div>
		);
	},

	save: ({ attributes }) => {
    const blockProps = useBlockProps.save({
      className: 'slider-block swiper',
    });

    return (

      <div {...blockProps}>
        <div className='slider-block__pagination-wrapper'>
          <h3 className='slider-block__heading'>{attributes.textString}</h3>
          <div className='slider-block__pagination'></div>
        </div>
        <div className='swiper-wrapper'>
          <InnerBlocks.Content />
        </div>

        <div className='slider-block__swiper-nav'>
          <div className='slider-block__button--prev'></div>
          <div className='slider-block__button--next'></div>
        </div>
      </div>

		);
	},
});

registerBlockType( 'kindling/slide-block', {
	title: __( 'Slide', 'kindling-slide-block' ),
  category: 'design',
  parent: ['kindling/kindling-slider-block'],

	edit() {
		const blockProps = useBlockProps({
      className: 'swiper-slide',
    });

    return (
      <InnerBlocks
        allowedBlocks={ ['core/heading', 'core/paragraph', 'core/button'] }
        template={ [
          [ 'core/heading', { level: 4, placeholder: 'Enter heading...' } ],
          [ 'core/paragraph', { placeholder: 'Enter text...' } ],
          [ 'core/button', { text: 'Click me' } ],
        ] }
        templateLock={ false }
      />
		);
	},

	save() {
    const blockProps = useBlockProps.save({
      className: 'swiper-slide',
    });

    return (
      <div {...blockProps}>
        <InnerBlocks.Content />
			</div>
		);
	},
});
