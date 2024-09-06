/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Save = () => {
  const blockProps = useBlockProps.save({
    className: 'swiper-slide',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
};
export default Save;
