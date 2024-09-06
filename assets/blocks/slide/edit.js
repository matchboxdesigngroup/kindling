/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Edit = (props) => {
  // Retrieve attributes from props
  const { attributes } = props;
  const { className } = attributes;

  // Use useBlockProps to dynamically set the className
  const blockProps = useBlockProps({
    className: className || 'swiper-slide', // Fallback to 'swiper-slide' if className is undefined
  });

  return (
    <div { ...blockProps }>
      <InnerBlocks />
    </div>
  );
};
export default Edit;
