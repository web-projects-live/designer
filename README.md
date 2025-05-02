# Design Editor

A frontend-only, browser-based design editor that allows users to place and customize text and shapes on a canvas using HTML5 Canvas.

## Features

- **Element Creation**: Add text, rectangles, circles, and triangles to the canvas
- **Element Manipulation**: Select, drag, and resize elements with intuitive controls
- **Property Editing**: Customize element properties like colors, sizes, and text attributes
- **Export Functionality**: Export your designs as PNG images

## Usage Instructions

### Creating Elements

1. Select a tool from the toolbar at the top of the screen:
   - **Text Tool**: Creates text elements
   - **Rectangle Tool**: Creates rectangle shapes
   - **Circle Tool**: Creates circle shapes
   - **Triangle Tool**: Creates triangle shapes

2. Click anywhere on the canvas to place the selected element type.

![Creating Elements](screenshots/creating_elements.png)

### Selecting and Manipulating Elements

1. **Select an Element**: Click on any element to select it. Selection is indicated by a blue dashed outline and resize handles.

2. **Move an Element**: Click and drag a selected element to move it to a new position.

3. **Resize an Element**: Click and drag any of the resize handles (small circles) that appear around a selected element.
   - Corner handles resize both width and height
   - Side handles resize only width or height
   - Hold Shift while resizing to maintain aspect ratio

![Manipulating Elements](screenshots/manipulating_elements.png)

### Editing Properties

When an element is selected, its properties appear in the properties panel on the right side of the screen.

#### Common Properties
- **Position (X, Y)**: Change the element's position
- **Size (Width, Height)**: Change the element's dimensions
- **Fill Color**: Change the element's fill color
- **Stroke Color**: Change the element's outline color
- **Stroke Width**: Change the thickness of the outline

#### Text-Specific Properties
- **Text Content**: Edit the text
- **Font Family**: Change the font
- **Font Size**: Change the text size
- **Font Weight**: Change between normal and bold
- **Text Alignment**: Align text left, center, or right

#### Shape-Specific Properties
- **Shape Type**: Change between different shape types
- **Fill Enabled**: Toggle fill on/off
- **Stroke Enabled**: Toggle outline on/off

![Editing Properties](screenshots/editing_properties.png)

### Canvas Actions

The toolbar provides several actions for managing your design:

- **Delete**: Remove the selected element from the canvas
- **Clear**: Remove all elements from the canvas
- **Export**: Save your design as a PNG image

### Exporting Your Design

1. Click the Export button in the toolbar
2. In the export dialog, enter a filename for your image
3. Click Export to download the PNG file

![Export Dialog](screenshots/export_dialog.png)

## Browser Compatibility

The Design Editor works in all modern browsers:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## Known Limitations

- No undo/redo functionality
- Limited shape types (only rectangles, circles, and triangles)
- No layer management or z-index control (elements are stacked in the order they were created)
- No grouping of elements
- No text wrapping for text elements
- No keyboard shortcuts

## Technical Implementation

The Design Editor is built using:
- HTML5 Canvas for rendering
- Vanilla JavaScript with object-oriented programming patterns
- CSS for styling the interface
- No external libraries or frameworks

The application follows a modular architecture with separate classes for:
- Canvas management
- Element base class and specific element types
- UI components (toolbar, properties panel)
- Utility functions (event handling, export)