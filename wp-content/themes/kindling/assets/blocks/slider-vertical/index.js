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
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

const TEMPLATE = [
  [ 'kindling/slide-block', { placeholder: 'Enter slide content...' } ],
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

  edit(props) {
		const blockProps = useBlockProps({
      className: 'wp-block-kindling-slider-block slider-block swiper',
    });

    const { attributes, clientId } = props;

    const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );
    const innerBlocks = useSelect(
      ( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
      [ clientId ]
    );

    const addNewSlide = (blocksToAdd = []) => {
      const slideBlock = createBlock('kindling/slide-block', {}, blocksToAdd);

      replaceInnerBlocks(clientId, [...innerBlocks, slideBlock], false);
    };

    return (
      <div>
        <BlockControls>
          <ToolbarGroup>
            <ToolbarButton
              icon="plus"
              title="Add Slide"
              onClick={() => addNewSlide()}
              disabled={ ! props.isSelected }
            />
          </ToolbarGroup>
        </BlockControls>
        <div {...blockProps}>
          <div className='swiper-wrapper'>
            <InnerBlocks
              template={ TEMPLATE }
            />
          </div>
          <div className='slider-block__swiper-nav'>
            <div className='slider-block__button--prev'></div>
            <div className='slider-block__button--next'></div>
          </div>
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
