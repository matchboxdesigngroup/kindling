const { getBlockVariations, registerBlockVariation } = wp.blocks;
const { __ } = wp.i18n;
const domReady = wp.domReady;

domReady(() => {
	const variations = getBlockVariations('core/group');

	if (! variations.some(variation => 'group-grid' === variation.name)) {
		registerBlockVariation('core/group', {
			name: 'group-grid',
			title: __('Grid', 'themeslug'),
			icon: 'grid-view',
			description: __('Arrange blocks in a grid.', 'themeslug'),
			attributes: {
				layout: {
					type: 'grid'
				}
			},
			scope: [ 'block', 'inserter', 'transform' ],
			isActive: (blockAttributes) =>
				blockAttributes.layout?.type === 'grid',
		});
	}
});
