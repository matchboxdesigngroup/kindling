import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks, BlockControls, useBlockProps } from '@wordpress/block-editor';
import { Toolbar, ToolbarButton, Card, CardBody, Button } from '@wordpress/components';
import { chevronLeft, chevronRight, plus } from '@wordpress/icons';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Register a new block type for managing slides
 */
registerBlockType( 'kindling/slider', {
  apiVersion: 2,
  title: __( 'Slider', 'kindling' ),
  category: 'layout',
  icon: 'id',

  /**
   * Supports
   */
  supports: {
    align: ['wide', 'full'], // You can specify which alignments to support
  },

  /**
    * The attributes object defines the data structure of the block.
   */
  attributes: {
    activeBlockIndex: {
      type: 'number',
      default: 0,
    },
  },

  /**
   * The edit function defines the functionality of the block within the editor.
   * This is where we use React Hooks to manage state and control the block's behaviour.
   */
  edit: (props) => {
    // destructuring props and attributes
    const { clientId, attributes, setAttributes } = props;
    const { activeBlockIndex } = attributes;

    // initializing hooks for dispatching actions and selecting data from the store
    const { getBlocks } = useSelect( select => select( 'core/block-editor' ) );

    // Get the selected block ID
    const selectedBlockId = useSelect( ( select ) => {
      const selectedBlock = select('core/block-editor').getSelectedBlock();
      return selectedBlock ? selectedBlock.clientId : null;
    }, []);

    // Dispatch actions
    const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
    const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

    // state variables
    const innerBlocks = getBlocks( clientId );
    const [ numOfBlocks, setNumOfBlocks ] = useState( innerBlocks.length );

    // block properties
    const blockProps = useBlockProps({
      className: 'slider-block',
    });

    //
    const handlePrev = () => {
      const newIndex = activeBlockIndex === 0 ? numOfBlocks - 1 : activeBlockIndex - 1;
      setAttributes({ activeBlockIndex: newIndex });
    };
    const handleNext = () => {
        const newIndex = activeBlockIndex === numOfBlocks - 1 ? 0 : activeBlockIndex + 1;
        setAttributes({ activeBlockIndex: newIndex });
    };

    // Function to add a new slide block
    const addNewSlide = () => {

      // Create a new slide block
      const slideBlock = createBlock('kindling/slide', { className: 'editor-inactive-block' }, [
        // Create a paragraph block with a placeholder
        createBlock('core/paragraph', { placeholder: __( 'Enter content.', 'kindling' ) }),
      ]);

      // Replace the inner blocks with the new slide block
      replaceInnerBlocks(clientId, [...innerBlocks, slideBlock], false);

      // Update the class name of the slide block if there are no inner blocks
      if (innerBlocks.length === 0) {
        updateBlockAttributes(slideBlock.clientId, { className: '' });
      }

      // Increment the number of blocks
      setNumOfBlocks(numOfBlocks + 1)
    };

    // hook to manage effects
    useEffect(() => {
      // Ensure state consistency and manage DOM querying
      setNumOfBlocks(innerBlocks.length);

      // Iterate over each block and set the active block
      innerBlocks.forEach((block, index) => {

        // Set the active block to the selected block - This is working
        if (block.clientId === selectedBlockId) {
          setAttributes({ activeBlockIndex: index });
        }

        // Set the class name of the block based on the active block index - This is not working
        const newClassName = index === activeBlockIndex ? 'editor-active-block' : 'editor-inactive-block';
        updateBlockAttributes(block.clientId, { className: newClassName });

      });
    }, [innerBlocks, activeBlockIndex, selectedBlockId, updateBlockAttributes]);

    // rendering the block within the editor
    return (
      <>
        <BlockControls>
          <Toolbar>
            <ToolbarButton
              children
              icon="plus"
              title="Add Slide"
              onClick={addNewSlide}
            />
            <ToolbarButton
              children
              icon={chevronLeft}
              onClick={handlePrev}
            />
            <ToolbarButton
              children
              icon={chevronRight}
              onClick={handleNext}
            />

          </Toolbar>
        </BlockControls>

        <Card>
          <CardBody
            className='kindling-block-header slider-header'
          >
          <Button
            className='kindling-block-header__button'
            icon={plus}
            isPrimary
            onClick={addNewSlide}
          >
            {__( 'Add Slide', 'kindling' )}
          </Button>

          <p>{ __( 'Editing slide', 'kindling' ) } {`${activeBlockIndex + 1} of ${numOfBlocks}`}</p>

          <div
            className='kindling-block-header__button-wrapper'
          >
            <Button
              className='kindling-block-header__button prev'
              icon={chevronLeft}
              onClick={handlePrev}
              variant='secondary'
            >
              { __( 'Previous', 'kindling' ) }
            </Button>
            <Button
              className='kindling-block-header__button next'
              icon={chevronRight}
              onClick={handleNext}
              variant='secondary'
            >
              { __( 'Next', 'kindling' ) }
            </Button>
          </div>

          </CardBody>
        </Card>

        <div {...blockProps}>
          {/* Slide block content will be rendered here */}
          <InnerBlocks allowedBlocks={['kindling/slide']} />
        </div>
      </>
    );
  },

  /**
   * Defines how the block will be saved in the post_content.
   * It will be saved as a div with the content of the InnerBlocks.
   */
  save: () => {
    const blockProps = useBlockProps.save({
      className: 'slider-block',
    });

    return (
      <div {...blockProps}>
        <div className="swiper-wrapper">
          <InnerBlocks.Content />
        </div>
        <div className="swiper-pagination slider-block__pagination"></div>
        {/* <div className="swiper-button-prev slider-block__button--prev"></div>
        <div className="swiper-button-next slider-block__button--next"></div> */}
      </div>
    );
  },
});
