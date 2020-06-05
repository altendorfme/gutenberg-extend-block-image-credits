# Extend block image credits

This is a wordPress plug-in that adds a credit field to the gutenberg image block.

![Johannes Gensfleisch zur Laden zum Gutenberg made after his death](https://i.imgur.com/vEaxmCY.gif)

This code was based on https://github.com/liip/extend-block-example-wp-plugin

## Developer information

Credits are saved in the *image_meta* of each image, and can be consulted with [wp_get_attachment_metadata()](https://developer.wordpress.org/reference/functions/wp_get_attachment_metadata/)

### Installation

1. Clone this repository

1. Install Node dependencies

    ```
    $ npm install
    ```

### Compile assets

#### `npm start`
- Use to compile and run the block in development mode.
- Watches for any changes and reports back any errors in your code.

#### `npm run build`
- Use to build production code for your block inside `dist` folder.
- Runs once and reports back the gzip file sizes of the produced code.
