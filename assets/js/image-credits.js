import assign from "lodash.assign";

const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;

const {
	PanelBody,
	TextControl,
	SelectControl,
	Button,
	Spinner,
} = wp.components;
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;

// Enable spacing control on the following blocks
const enableCreditsControlOnBlocks = ["core/image"];

/**
 * Create HOC to add credits field to inspector controls of block.
 */
const withCreditsControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		// Do nothing if it's another block than our defined ones.
		if (!enableCreditsControlOnBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { credits, id } = props.attributes;

		// add has-spacing-xy class to block
		if (credits) {
			props.attributes.className = `has-credits`;
		}

		if (!props.attributes.inited) {
			if (id) {
				props.setAttributes({
					loading: true,
				});
				let media = new wp.api.models.Media({ id: id });
				media.fetch().done(() => {
					try {
						let value = media.attributes.media_details.image_meta.credit;
						props.setAttributes({
							credits: value,
							inited: true,
							credits_saved: true,
							loading: false,
							image_added: true,
						});
					} catch (e) {}
				});
			} else {
				props.setAttributes({
					loading: false,
				});
			}
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__("Crédito")} initialOpen={true}>
						<div className={"gutenberg-extend-block-image-credits"}>
							<TextControl
								value={credits}
								disabled={!id || props.attributes.loading}
								onChange={(text) => {
									props.setAttributes({
										credits: text,
										credits_saved: false,
									});
								}}
							/>
							<Button
								className={"components-button is-primary"}
								disabled={
									!id ||
									props.attributes.credits_saved === true ||
									props.attributes.loading
								}
								onClick={() => {
									props.setAttributes({
										loading: true,
									});
									let attachment = new wp.api.models.Media({ id: id });
									attachment.set("image_meta_credit", credits);
									attachment
										.save({
											status: "publish",
										})
										.done(() => {
											props.setAttributes({
												credits_saved: true,
												loading: false,
											});
										});
								}}
							>
								<div
									className={
										"dashicons gutenberg-extend-block-image-credits_save"
									}
								></div>
							</Button>
							{props.attributes.loading && <Spinner />}
						</div>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "withCreditsControl");

addFilter(
	"editor.BlockEdit",
	"extend-block-image-credits/with-credits-control",
	withCreditsControl
);

/**
 * Add margin style attribute to save element of block.
 *
 * @param {object} saveElementProps Props of save element.
 * @param {Object} blockType Block type information.
 * @param {Object} attributes Attributes of block.
 *
 * @returns {object} Modified props of save element.
 */
const addCreditsExtraProps = (saveElementProps, blockType, attributes) => {
	// Do nothing if it's another block than our defined ones.
	if (!enableCreditsControlOnBlocks.includes(blockType.name)) {
		return saveElementProps;
	}

	return saveElementProps;
};

addFilter(
	"blocks.getSaveContent.extraProps",
	"extend-block-image-credits/get-save-content/extra-props",
	addCreditsExtraProps
);
