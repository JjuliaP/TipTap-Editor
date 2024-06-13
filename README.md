# Editor Component

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Overview

The Editor component integrates a rich text editing experience using Tiptap with additional functionalities:

- **Editor Content**: Displays editable content using Tiptap's `Editor` component.
- **Font Weight Slider**: Allows users to adjust font weight for selected text using a range input.
- **Export Text Button**: Downloads text content with applied font weights as a JSON file in format `{word: 40}`.

## Script Details

- **Imports**: Includes necessary dependencies and extensions (`TextStyle`, `StarterKit`, `FontWeight`) for Tiptap.
- **State Management**: Uses Vue's `ref` for managing editor instance (`editor`), content (`content`), visibility of font weight slider (`showSlider`), selected font weight (`fontWeight`), and selected text range (`selectedRange`).
- **Lifecycle Hooks**: Utilizes `onMounted` to initialize the editor with default content and extensions.
- **Event Handlers**: Implements event handlers like `onSelectionUpdate` and `onBlur` to manage UI state based on text selection and focus events.
- **Functions**: Defines functions for handling font weight adjustments (`updatefontWeight`) and exporting text content (`exportText`).
- **Download Function**: Creates a utility function (`download`) for generating downloadable files from JSON data.

## Style Details

- **Global Styles**: Sets up global styles for the editor using `Poppins` font, with utility functions (`toRem`) for responsive design.
- **Editor Styles**: Defines styles for the editor container (`editor`), content area (`editor__content`), font weight slider (`editor__slider`), and export button (`editor__button`).
- **Slider Styles**: Customizes appearance of the font weight slider (`editor__slider-input`) with gradient background and thumb styles for both webkit and moz browsers.

## Dependencies

- **Vue 3**: Utilizes Vue for reactive and component-based UI development.
- **Tiptap**: Provides rich text editing capabilities with modular extensions like `TextStyle` and `FontWeight`.

## Usage

This component can be used in Vue applications where rich text editing with style customization (like font weight) and text export functionality is required. It integrates well with Vue 3's reactive data management and Tiptap's extensible editor capabilities.

