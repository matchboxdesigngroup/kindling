<?php
/**
 * Prompt user to install Kindling Blocks when the theme is activated.
 * 
 * @package Kindling
 */
namespace Kindling;

use WP_Error;

if ( ! function_exists( __NAMESPACE__ . '\kindling_blocks_show_notice' ) ) :

	/**
	 * Show a persistent notice until Kindling Blocks is installed and active.
	 * Includes a one-click install/activate flow for a private ZIP package.
	 */
	function kindling_blocks_show_notice() {
		// Ensure we can check plugin status.
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		// Only show to admins who can install/activate plugins.
		if ( ! current_user_can( 'install_plugins' ) ) {
			return;
		}

		$plugin_main  = 'kindling-blocks/kindling-blocks.php';
		$is_installed = file_exists( WP_PLUGIN_DIR . '/' . $plugin_main );
		$is_active    = function_exists( 'is_plugin_active' ) && is_plugin_active( $plugin_main );

		if ( $is_active ) {
			return; // Nothing to do.
		}

		// Message + primary action changes based on install/activate state.
		$headline = __( 'Kindling theme is active.', 'kindling' );
		$body     = __( 'This theme requires the Kindling Blocks plugin for full functionality.', 'kindling' );

		// Private ZIP endpoint (can be a signed URL). Filterable for licensing.
		$default_package = 'https://kindlingwp.com/plugins/kindling-blocks/latest.zip';
		$package_url     = apply_filters( 'kindling_blocks_package_url', $default_package );

		// If already installed (but inactive), offer an Activate link.
		if ( $is_installed ) {
			$primary_url = wp_nonce_url(
				self_admin_url( 'plugins.php?action=activate&plugin=' . rawurlencode( $plugin_main ) ),
				'activate-plugin_' . $plugin_main
			);
			$primary_label = __( 'Activate Kindling Blocks', 'kindling' );
		} else {
			// Point to our admin-post handler that downloads & installs from $package_url.
			$primary_url = wp_nonce_url(
				admin_url( 'admin-post.php?action=kindling_blocks_remote_install&pkg=' . rawurlencode( $package_url ) ),
				'kindling_blocks_remote_install'
			);
			$primary_label = __( 'Install Kindling Blocks', 'kindling' );
		}

		// Secondary "Learn more / Get plugin" page on your site.
		$learn_more_url = apply_filters( 'kindling_blocks_learn_more_url', 'https://kindlingwp.com/plugins/kindling-blocks' );

		echo '<div class="notice notice-warning is-dismissible">';
		echo '<p><strong>' . esc_html( $headline ) . '</strong> ' . esc_html( $body ) . '</p>';
		echo '<p>';
		echo '<a href="' . esc_url( $primary_url ) . '" class="button button-primary" style="margin-right:8px;">' . esc_html( $primary_label ) . '</a>';
		echo '<a href="' . esc_url( $learn_more_url ) . '" class="button" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Learn more', 'kindling' ) . '</a>';
		echo '</p>';
		echo '</div>';
	}
	add_action( 'admin_notices', __NAMESPACE__ . '\kindling_blocks_show_notice' );

endif;

if ( ! function_exists( __NAMESPACE__ . '\kindling_blocks_handle_remote_install' ) ) :

	/**
	 * Handle one-click remote install from a private ZIP, then auto-activate.
	 * URL: /wp-admin/admin-post.php?action=kindling_blocks_remote_install&pkg=<encoded zip url>
	 */
	function kindling_blocks_handle_remote_install() {
		if ( ! current_user_can( 'install_plugins' ) ) {
			wp_die( esc_html__( 'You do not have permission to install plugins.', 'kindling' ) );
		}

		check_admin_referer( 'kindling_blocks_remote_install' );

		$package = isset( $_GET['pkg'] ) ? esc_url_raw( wp_unslash( $_GET['pkg'] ) ) : '';
		if ( empty( $package ) ) {
			wp_safe_redirect( add_query_arg( [ 'kindling_blocks' => 'no_package' ], admin_url() ) );
			exit;
		}

		// Load upgrader dependencies.
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/misc.php';
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		// Request filesystem creds if needed (FTP, etc.).
		$creds = request_filesystem_credentials( admin_url(), '', false, false, null );
		if ( false === $creds ) {
			return; // WP will show the credentials form and re-post here.
		}

		if ( ! WP_Filesystem( $creds ) ) {
			wp_safe_redirect( add_query_arg( [ 'kindling_blocks' => 'fs_error' ], admin_url() ) );
			exit;
		}

		// Use a quiet skin to avoid dumping HTML into the redirect response.
		$skin      = new \Automatic_Upgrader_Skin();
		$upgrader  = new \Plugin_Upgrader( $skin );
		$result    = $upgrader->install( $package );

		if ( is_wp_error( $result ) ) {
			wp_safe_redirect( add_query_arg( [ 'kindling_blocks' => 'install_error', 'msg' => rawurlencode( $result->get_error_message() ) ], admin_url( 'plugins.php' ) ) );
			exit;
		}

		// If install succeeded, try to get the plugin file path from the result.
		$plugin_file = '';
		if ( ! empty( $upgrader->plugin_info() ) ) {
			$plugin_file = $upgrader->plugin_info(); // e.g. 'kindling-blocks/kindling-blocks.php'
		} else {
			// Fallback to our expected main file.
			$plugin_file = 'kindling-blocks/kindling-blocks.php';
		}

		// Activate the plugin.
		$activate = activate_plugin( $plugin_file );
		if ( is_wp_error( $activate ) ) {
			wp_safe_redirect( add_query_arg( [ 'kindling_blocks' => 'activate_error', 'msg' => rawurlencode( $activate->get_error_message() ) ], admin_url( 'plugins.php' ) ) );
			exit;
		}

		// Success — go to Plugins screen with a success param.
		wp_safe_redirect( add_query_arg( [ 'kindling_blocks' => 'installed' ], admin_url( 'plugins.php' ) ) );
		exit;
	}
	add_action( 'admin_post_kindling_blocks_remote_install', __NAMESPACE__ . '\kindling_blocks_handle_remote_install' );

endif;

if ( ! function_exists( __NAMESPACE__ . '\kindling_blocks_result_notice' ) ) :

	/**
	 * Optional: surface result messages after install/activate redirects.
	 */
	function kindling_blocks_result_notice() {
		if ( empty( $_GET['kindling_blocks'] ) ) {
			return;
		}

		$code = sanitize_text_field( wp_unslash( $_GET['kindling_blocks'] ) );
		$msg  = '';

		switch ( $code ) {
			case 'installed':
				$msg = __( 'Kindling Blocks was installed and activated successfully.', 'kindling' );
				$cls = 'updated';
				break;
			case 'no_package':
				$msg = __( 'Download URL missing for Kindling Blocks.', 'kindling' );
				$cls = 'error';
			 break;
			case 'fs_error':
				$msg = __( 'Could not initialize the filesystem API. Please try again.', 'kindling' );
				$cls = 'error';
				break;
			case 'install_error':
			case 'activate_error':
				$err = isset( $_GET['msg'] ) ? wp_kses_post( wp_unslash( $_GET['msg'] ) ) : __( 'Unknown error.', 'kindling' );
				$msg = sprintf( /* translators: %s: error message */ __( 'Kindling Blocks setup failed: %s', 'kindling' ), $err );
				$cls = 'error';
				break;
			default:
				return;
		}

		echo '<div class="notice ' . esc_attr( $cls ) . ' is-dismissible"><p>' . $msg . '</p></div>';
	}
	add_action( 'admin_notices', __NAMESPACE__ . '\kindling_blocks_result_notice' );

endif;
