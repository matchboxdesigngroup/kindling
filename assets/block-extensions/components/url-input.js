/* eslint-disable no-unused-vars */

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useRef, useState, useCallback, Fragment } = wp.element;
const {
	Button,
	ToggleControl,
  TextControl,
} = wp.components;
const { URLPopover } = wp.blockEditor;
const { LEFT, RIGHT, UP, DOWN, BACKSPACE, ENTER } = wp.keycodes;

const URLInput = ( {
	onChangeUrl,
	url,
	opensInNewTab,
	linkNoFollow,
	linkSponsored,
  ariaLabel,
} ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const openLinkUI = useCallback( () => {
		setIsOpen( true );
	} );

	const [ isEditingLink, setIsEditingLink ] = useState( false );
	const [ urlInput, setUrlInput ] = useState( null );

	const autocompleteRef = useRef( null );

	const stopPropagation = ( event ) => {
		event.stopPropagation();
	};

	const stopPropagationRelevantKeys = ( event ) => {
		if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( event.keyCode ) > -1 ) {
			// Stop the key event from propagating up to ObserveTyping.startTypingInTextField.
			event.stopPropagation();
		}
	};

	const startEditLink = useCallback( () => {
		setIsEditingLink( true );
	} );

	const stopEditLink = useCallback( () => {
		setIsEditingLink( false );
	} );

	const closeLinkUI = useCallback( () => {
		setUrlInput( null );
		stopEditLink();
		setIsOpen( false );
	} );

	const onFocusOutside = useCallback( () => {
		return ( event ) => {
			// The autocomplete suggestions list renders in a separate popover (in a portal),
			// so onFocusOutside fails to detect that a click on a suggestion occurred in the
			// LinkContainer. Detect clicks on autocomplete suggestions using a ref here, and
			// return to avoid the popover being closed.
			const autocompleteElement = autocompleteRef.current;
			if ( autocompleteElement && autocompleteElement.contains( event.target ) ) {
				return;
			}
			setIsOpen( false );
			setUrlInput( null );
			stopEditLink();
		};
	} );

	const onSubmitLinkChange = useCallback( () => {
		return ( event ) => {
			if ( urlInput ) {
				onChangeUrl( { href: urlInput } );
			}
			stopEditLink();
			setUrlInput( null );
			event.preventDefault();
		};
	} );

	const onLinkRemove = useCallback( () => {
		onChangeUrl( {
			href: '',
      ariaLabel: '',
		} );
	} );

	const onSetNewTab = ( value ) => {
		onChangeUrl( { opensInNewTab: value } );
	};

	const onSetLinkNoFollow = ( value ) => {
		onChangeUrl( { linkNoFollow: value } );
	};

	const onSetLinkSponsored = ( value ) => {
		onChangeUrl( { linkSponsored: value } );
	};

  const onSetAriaLabel = ( value ) => {
		onChangeUrl( { ariaLabel: value } );
	};

	const advancedOptions = (
		<>
			<ToggleControl
				label={ __( 'Open in New Tab', 'kindling' ) }
				onChange={ onSetNewTab }
				checked={ opensInNewTab }
			/>
			<ToggleControl
				label={ __( 'No Follow', 'kindling' ) }
				onChange={ onSetLinkNoFollow }
				checked={ linkNoFollow }
			/>
			<ToggleControl
				label={ __( 'Sponsored', 'kindling' ) }
				onChange={ onSetLinkSponsored }
				checked={ linkSponsored }
			/>
      <TextControl
        label="Aria Label"
        value={ ariaLabel || '' }
        onChange={ ( newAriaLabel ) => onSetAriaLabel( newAriaLabel ) }
      />
		</>
	);

	const linkEditorValue = urlInput !== null ? urlInput : url;

	return (
		<Fragment>
			<Button
				icon="admin-links"
				className="components-toolbar__control"
				label={
					url ?
						__( 'Edit link', 'kindling' ) :
						__( 'Insert link', 'kindling' )
				}
				aria-expanded={ isOpen }
				onClick={ openLinkUI }
			/>
			{ isOpen && (
				<URLPopover
					onFocusOutside={ onFocusOutside() }
					onClose={ closeLinkUI }
					renderSettings={ () => advancedOptions }
				>
					{ ( ! url || isEditingLink ) && (
						<URLPopover.LinkEditor
							className="block-editor-format-toolbar__link-container-content"
							value={ linkEditorValue }
							onChangeInputValue={ setUrlInput }
							onKeyDown={ stopPropagationRelevantKeys }
							onKeyPress={ stopPropagation }
							onSubmit={ onSubmitLinkChange() }
							autocompleteRef={ autocompleteRef }
						/>
					) }
					{ url && ! isEditingLink && (
						<>
							<URLPopover.LinkViewer
								className="block-editor-format-toolbar__link-container-content"
								onKeyPress={ stopPropagation }
								url={ url }
								onEditLinkClick={ startEditLink }
							/>
							<Button
								icon="no"
								label={ __( 'Remove link', 'kindling' ) }
								onClick={ onLinkRemove }
							/>
						</>
					) }
				</URLPopover>
			) }
		</Fragment>
	);
};

export default URLInput;
