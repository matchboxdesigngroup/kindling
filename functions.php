<?php
/**
 * Registers block patterns for the theme.
 * 
 * @since TBD
 * 
 * @return void
 */
function register_theme_patterns() {
	// Check if register_block_pattern exists (WordPress 5.5+).
	if ( ! function_exists( 'register_block_pattern' ) ) {
		return;
	}

	$patterns_dir = get_stylesheet_directory() . '/patterns/';
	if ( ! is_dir( $patterns_dir ) ) {
		return;
	}

	$pattern_files = glob( $patterns_dir . '*.php' );
	if ( ! $pattern_files ) {
		return;
	}

	foreach ( $pattern_files as $file ) {
		$raw_content = file_get_contents( $file );
		if ( ! $raw_content ) {
			continue;
		}

		// Extract the doc block header lines and content.
		$header = [];
		$content = '';

		// Split file lines.
		$lines = preg_split( '/\r\n|\r|\n/', $raw_content );

		// We'll parse from the start until we hit the first non-comment line or closing PHP tag.
		$in_header = false;

		foreach ( $lines as $line ) {
			// Trim whitespace.
			$trimmed = trim( $line );

			// Detect start of header doc block: `/**` or `/*`
			if ( preg_match( '/^\/\*\*/', $trimmed ) ) {
				$in_header = true;
				continue;
			}
			
			// Detect end of doc block: `*/`
			if ( preg_match( '/\*\//', $trimmed ) ) {
				$in_header = false;
				continue;
			}

			if ( $in_header ) {
				// Example line: ` * Title: My Pattern`.
				// Remove leading ` *`.
				$line_str = preg_replace( '/^(\s*\*\s?)/', '', $trimmed );

				// Now see if it matches "Key: Value".
				if ( strpos( $line_str, ':' ) !== false ) {
					$parts = explode( ':', $line_str, 2 );
					$key   = sanitize_text_field( trim( $parts[0] ) ); // e.g. "Title".
					$val   = sanitize_text_field( trim( $parts[1] ) ); // e.g. "My Pattern".
					
					$header[ strtolower( $key ) ] = $val;
				}
			} else {
				// Once doc block is finished, the rest is content.
				$content .= $line . "\n";  
			}
		}

		// Map doc block keys to pattern registration array 
		// e.g. Title => 'title', Slug => 'slug', Categories => 'categories'.
		$pattern_args = [
			'title'      => $header['title'] ?? null,
			'slug'       => $header['slug'] ?? null,
			'categories' => [],
			'content'    => '',
			'blockTypes' => [],
			'postTypes'  => [],
			'inserter'   => true,
		];

		// If "Categories: cat1, cat2", convert to array.
		if ( ! empty( $header['categories'] ) ) {
			// E.g. "matchbox/media, matchbox/featured, matchbox/gallery"
			$cats = array_map( 'trim', explode( ',', $header['categories'] ) );
			$pattern_args['categories'] = $cats;
		}
		
		// If "Block Types: core/paragraph, core/quote", etc.
		if ( ! empty( $header['block types'] ) ) {
			$blocks = array_map( 'trim', explode( ',', $header['block types'] ) );
			$pattern_args['blockTypes'] = $blocks;
		}
		
		// If "Post Types: post, page".
		if ( ! empty( $header['post types'] ) ) {
			$posts = array_map( 'trim', explode( ',', $header['post types'] ) );
			$pattern_args['postTypes'] = $posts;
		}
		
		// If "Inserter: false" or "Inserter: true".
		if ( isset( $header['inserter'] ) ) {
			$pattern_args['inserter'] = ( 'true' === strtolower( $header['inserter'] ) );
		}

		// 'Slug' should follow the format 'namespace/pattern-slug' like 'matchbox/instagram-grid'.
		$name = $pattern_args['slug'] ? sanitize_title( $pattern_args['slug'] ) : null;

		// Bail if we don't have a name or title.
		if ( ! $pattern_args['title'] || ! $name ) {
			continue;
		}

		// Now that $content is fully built, remove any stray PHP tags:
		$content = str_replace( '<?php', '', $content );
		$content = str_replace( '?>', '', $content );

		// The remaining file content is block markup.
		$pattern_args['content'] = $content;

		// Use 'Slug: namespace-pattern-slug' as 'name' => 'namespace/pattern-slug' or extract a prefix.
		$pattern_name = ( false === strpos( $name, '/' ) )
			? 'theme/' . $name // fallback.
			: $name;

		// Register the pattern.
		register_block_pattern(
			$pattern_name,
			[
				'title'      => $pattern_args['title'],
				'categories' => $pattern_args['categories'],
				'blockTypes' => $pattern_args['blockTypes'],
				'postTypes'  => $pattern_args['postTypes'],
				'inserter'   => $pattern_args['inserter'],
				'content'    => $pattern_args['content'],
			]
		);
	}
}

add_action( 'init', 'register_theme_patterns' );
