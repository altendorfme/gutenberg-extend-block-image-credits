<?php
/**
 * Plugin Name: Gutenberg Extend Block: Image Credits
 * Description: This plugin add credits field to guttenberg image element.
 * Author: Vadim Zhuk
 * Author URI: https://www.upwork.com/fl/vzhuk
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: gutenberg-extend-block-image-credits
 *
 * @package gutenberg-extend-block-image-credits
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Enqueue our script
add_action( 'enqueue_block_editor_assets', 'gebic_enqueue' );
function gebic_enqueue() {
    wp_enqueue_script(
        'gebic',
        esc_url( plugins_url( '/dist/extend-block-image-credits.js', __FILE__ ) ),
        array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-api'),
        '1.0.0',
        true // Enqueue the script in the footer.
	);

    wp_enqueue_style(
        'gebic',
        esc_url( plugins_url( '/dist/extend-block-image-credits.css', __FILE__ ) ),
        [],
        false
    );
}

// Rest after insert attachment hook
add_action( 'rest_after_insert_attachment', 'gebic_restHook');
function gebic_restHook ($attachment) {
	// Read json because arguments dont pass to the hook
	try {
		$data = json_decode( file_get_contents( 'php://input' ), true );

		if ( isset( $data['id'] ) && isset( $data['image_meta_credit'] ) ) {

			$new_meta                         = wp_get_attachment_metadata( $data['id'], true );
			$new_meta['image_meta']['credit'] = $data['image_meta_credit'];
			$r                                = wp_update_attachment_metadata(
				$data['id'],
				$new_meta
			);

			return $r;
		}
	} catch (Exception $e) {}

	return false;
}