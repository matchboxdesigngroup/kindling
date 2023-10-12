/* eslint-disable no-unused-vars */

import { registerBlockType } from '@wordpress/blocks';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl } from '@wordpress/components';

/**
 * Registers the 'Publication Categories Link List' block.
 */
registerBlockType('kindling/publications-categories-link-list', {
    title: 'Publications Category Link List',
    icon: 'list-view',
    category: 'common',
    attributes: {
      taxonomy: {
        type: 'string',
        default: 'type',
      },
    },
    supports: {
      anchor: true,
      align: [ 'left', 'right' ],
      alignWide: false,
      color: {
        text: false,
      },
      position: {
        sticky: true,
      },
      spacing: {
        blockGap: true,
        margin: true,
        padding: true,
      },
      typography: {
        fontSize: true,
        lineHeight: true,
      },
    },
    /**
     * Edit function for the block.
     * Fetch all publication-category posts from the publications cpt.
     *
     * @param {Object} props The properties passed to the edit function.
     * @returns {JSX.Element} The JSX Element to be rendered in the editor.
     */
    edit: (props) => {
      const taxonomy = 'publication-category'; // Hardcoded taxonomy

      // Fetching terms for the hardcoded taxonomy
      const terms = useEntityRecords('taxonomy', taxonomy, { per_page: -1 });

      const termsArray = terms ? terms.records : null;

      if (!Array.isArray(termsArray)) {
        return 'Loading terms...';
      }

      // Organize terms into a hierarchical structure
      const termsTree = termsArray.reduce((acc, term) => {
        acc[term.id] = { term, children: [] };
        return acc;
      }, {});

      termsArray.forEach((term) => {
          if (term.parent !== 0 && termsTree[term.parent]) {
            termsTree[term.parent].children.push(termsTree[term.id]);
          }
      });

      const handleTermClick = (termLink) => {
          window.location.href = termLink; // Navigate to the category archive page
      };

      const renderTerm = (termTree) => (
        <li key={termTree.term.id}>
          <a
            href={termTree.term.link}
            aria-label={`View all publications in ${termTree.term.name}`}
            onClick={(e) => {
              e.preventDefault();
              handleTermClick(termTree.term.link);
            }}
            style={{ cursor: 'pointer' }} // Changes the cursor to the pointer
          >
            {termTree.term.name}
          </a>
          {termTree.children.length > 0 && (
            <ul className='publication-category-submenu'>
              {termTree.children.map(renderTerm)}
            </ul>
          )}
        </li>
      );

      if (terms === null) {
        return 'Loading terms...';
      }

      if (terms.length === 0) {
        return 'No terms found.';
      }

      return (
        <div className="wp-block-kindling-publications-categories-link-list publications-categories-link-list">
          <div className="publications-categories-link-list__responsive">
            <nav aria-label="Publication Categories" className='desktop'>
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
      );
    },
    /**
     * Save function for the block.
     *
     * @returns {null} Indicates that the block is rendered on the server side.
     */
    save: () => {
      // Rendered on the server side with PHP in /inc/block-renders.php
      return null;
    },
});
