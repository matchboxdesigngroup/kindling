/* eslint-disable no-unused-vars */

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const { BlockControls } = wp.blockEditor;
const { ToolbarGroup, withSpokenMessages } = wp.components;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
 * Internal dependencies
 */
import URLInput from '../../../components/url-input';

class withLinkToolbar extends Component {
	constructor() {
		super( ...arguments );

		this.onSetHref = this.onSetHref.bind( this );
	}

	onSetHref( props ) {
		this.props.setAttributes( props );
	}

	render() {
		const {
			attributes,
		} = this.props;

		const {
			href,
			opensInNewTab,
			linkNoFollow,
			linkSponsored,
      ariaLabel,
		} = attributes;

		return (
			<Fragment>
				<BlockControls>
					<ToolbarGroup>
						<URLInput
							url={ href || '' }
							opensInNewTab={ opensInNewTab || false }
							linkNoFollow={ linkNoFollow || false }
							linkSponsored={ linkSponsored || false }
							onChangeUrl={ this.onSetHref }
              ariaLabel={ariaLabel || ''}
						/>
					</ToolbarGroup>
				</BlockControls>
			</Fragment>
		);
	}
}

export default compose(
	withSelect( ( select, props ) => {
		const {
			attributes,
		} = props;

		return {
			attributes,
		};
	} ),
	withSpokenMessages
)( withLinkToolbar );
