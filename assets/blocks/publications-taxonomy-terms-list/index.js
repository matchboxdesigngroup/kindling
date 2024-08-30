import { registerBlockType } from '@wordpress/blocks';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

registerBlockType('kindling/categories-link-list', {
    title: 'Category Link List',
    icon: 'list-view',
    category: 'common',
    attributes: {
        taxonomy: {
            type: 'string',
            default: '',
        },
    },
    supports: {
        anchor: true,
        align: ['left', 'right'],
        alignWide: false,
        color: { text: false },
        position: { sticky: true },
        spacing: { blockGap: true, margin: true, padding: true },
        typography: { fontSize: true, lineHeight: true },
    },
    edit: (props) => {
        const { attributes: { taxonomy }, setAttributes } = props;

        // Fetch available taxonomies
        const availableTaxonomies = useSelect((select) => {
            const { getTaxonomies } = select('core');
            return getTaxonomies();
        }, []);

        console.log(availableTaxonomies, 'availableTaxonomies');

        // Check if taxonomies are still loading
        if (!availableTaxonomies) {
            return 'Loading taxonomies...';
        }

        // Check if availableTaxonomies is a valid array
        if (!Array.isArray(availableTaxonomies) || !availableTaxonomies.length) {
            return 'No taxonomies available.';
        }

        // Map available taxonomies to SelectControl options
        const taxonomyOptions = availableTaxonomies.map((tax) => ({
            label: tax.name,
            value: tax.slug,
        }));

        // Fetch terms for the selected taxonomy using the correct parameters
        const { records: termsArray, isResolving } = useEntityRecords(
            'taxonomy',
            taxonomy || 'category',
            { per_page: -1 }
        );

        const handleTaxonomyChange = (newTaxonomy) => {
            setAttributes({ taxonomy: newTaxonomy });
        };

        // Build a terms tree if terms are available
        const termsTree = termsArray?.reduce((acc, term) => {
            acc[term.id] = { term, children: [] };
            return acc;
        }, {}) || {};

        termsArray?.forEach((term) => {
            if (term.parent !== 0 && termsTree[term.parent]) {
                termsTree[term.parent].children.push(termsTree[term.id]);
            }
        });

        const handleTermClick = (termLink) => {
            window.location.href = termLink;
        };

        const renderTerm = (termTree) => (
            <li key={termTree.term.id}>
                <a
                    href={termTree.term.link}
                    aria-label={`View all posts in ${termTree.term.name}`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleTermClick(termTree.term.link);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {termTree.term.name}
                </a>
                {termTree.children.length > 0 && (
                    <ul className={`${taxonomy}-submenu`}>
                        {termTree.children.map(renderTerm)}
                    </ul>
                )}
            </li>
        );

        return (
            <>
                <InspectorControls>
                    <PanelBody title="Settings">
                        <SelectControl
                            label="Choose Taxonomy"
                            value={taxonomy}
                            options={taxonomyOptions}
                            onChange={handleTaxonomyChange}
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={`wp-block-kindling-${taxonomy}-link-list ${taxonomy}-link-list`}>
                    <div className={`${taxonomy}-link-list__responsive`}>
                        <nav aria-label="Category List" className="desktop">
                            <ul className="list-none pl-0">
                                {Object.values(termsTree).map(renderTerm)}
                            </ul>
                        </nav>
                        <select className="mobile">
                            {Object.values(termsTree).map(term => (
                                <option key={term.term.id} value={term.term.link}>
                                    {term.term.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </>
        );
    },
    save: () => {
        return null;
    },
});
