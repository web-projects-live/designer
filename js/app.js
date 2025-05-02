/**
 * Main application initialization
 * Sets up the canvas and UI components
 */
import Canvas from './canvas/Canvas.js';
import CanvasRenderer from './canvas/CanvasRenderer.js';
import TextElement from './elements/TextElement.js';
import ShapeElement from './elements/ShapeElement.js';
import Toolbar from './ui/Toolbar.js';
import PropertiesPanel from './ui/PropertiesPanel.js';
import ExportUtils from './utils/export.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
  // Get the canvas element
  const canvasElement = document.getElementById('design-canvas');
  
  // Set canvas size to match container
  const canvasContainer = document.querySelector('.canvas-container');
  canvasElement.width = canvasContainer.clientWidth;
  canvasElement.height = canvasContainer.clientHeight;
  
  // Create Canvas instance
  const canvas = new Canvas(canvasElement, {
    width: canvasElement.width,
    height: canvasElement.height,
    backgroundColor: '#ffffff'
  });
  
  // Create CanvasRenderer
  const renderer = new CanvasRenderer(canvas);
  
  // Initialize UI components
  const toolbar = initializeToolbar(canvas);
  const propertiesPanel = initializePropertiesPanel(canvas);
  
  // Set up window resize handler
  window.addEventListener('resize', () => {
    // Update canvas size on window resize
    canvasElement.width = canvasContainer.clientWidth;
    canvasElement.height = canvasContainer.clientHeight;
    canvas.resize(canvasElement.width, canvasElement.height);
  });
  
  // Add some example elements for testing
  addExampleElements(canvas);
}

/**
 * Initialize the toolbar
 * @param {Canvas} canvas - The canvas instance
 * @returns {Toolbar} The toolbar instance
 */
function initializeToolbar(canvas) {
  const toolbarElement = document.getElementById('toolbar');
  const toolbar = new Toolbar(toolbarElement);
  
  // Handle tool selection
  toolbarElement.addEventListener('tool:selected', (event) => {
    const toolId = event.detail.toolId;
    handleToolSelection(canvas, toolId);
  });
  
  // Handle delete action
  toolbarElement.addEventListener('action:delete', () => {
    const selectedElement = canvas.getSelectedElement();
    if (selectedElement) {
      canvas.removeElement(selectedElement);
    }
  });
  
  // Handle clear action
  toolbarElement.addEventListener('action:clear', () => {
    canvas.clearElements();
  });
  
  // Handle export action
  toolbarElement.addEventListener('action:export', () => {
    // Use the new ExportUtils to show export dialog
    const exportDialog = ExportUtils.showExportDialog(canvas);
    document.body.appendChild(exportDialog);
  });
  
  return toolbar;
}

/**
 * Initialize the properties panel
 * @param {Canvas} canvas - The canvas instance
 * @returns {PropertiesPanel} The properties panel instance
 */
function initializePropertiesPanel(canvas) {
  const propertiesPanelElement = document.getElementById('properties-panel');
  const propertiesPanel = new PropertiesPanel(propertiesPanelElement);
  
  // Listen for element selection to update properties panel
  canvas.canvas.addEventListener('element:selected', (event) => {
    propertiesPanel.updatePanel(event.detail.element);
  });
  
  canvas.canvas.addEventListener('element:deselected', () => {
    propertiesPanel.clear();
  });
  
  // Listen for property changes
  propertiesPanelElement.addEventListener('element:updated', () => {
    canvas.render();
  });
  
  return propertiesPanel;
}

/**
 * Handle tool selection
 * @param {Canvas} canvas - The canvas instance
 * @param {string} toolId - Selected tool ID
 */
function handleToolSelection(canvas, toolId) {
  // Set cursor style based on selected tool
  canvas.canvas.style.cursor = getCursorForTool(toolId);
  
  // Set up click handler for adding new elements
  canvas.canvas.onclick = (event) => {
    // Only add element if not clicking on an existing element
    if (!canvas.getElementAt(event.offsetX, event.offsetY)) {
      addNewElement(canvas, toolId, event.offsetX, event.offsetY);
    }
  };
}

/**
 * Get cursor style for tool
 * @param {string} toolId - Tool ID
 * @returns {string} Cursor style
 */
function getCursorForTool(toolId) {
  switch (toolId) {
    case 'text':
      return 'text';
    case 'rect':
    case 'circle':
    case 'triangle':
      return 'crosshair';
    default:
      return 'default';
  }
}

/**
 * Add a new element based on selected tool
 * @param {Canvas} canvas - The canvas instance
 * @param {string} toolId - Selected tool ID
 * @param {number} x - X position
 * @param {number} y - Y position
 */
function addNewElement(canvas, toolId, x, y) {
  let element;
  
  switch (toolId) {
    case 'text':
      element = new TextElement({
        x: x - 50,
        y: y - 12,
        text: 'New Text',
        fontFamily: 'Arial',
        fontSize: 18,
        fill: 'transparent',
        stroke: '#000000'
      });
      break;
    case 'rect':
      element = new ShapeElement({
        x: x - 50,
        y: y - 50,
        width: 100,
        height: 100,
        shapeType: 'rect',
        fill: '#e3f2fd',
        stroke: '#2196f3',
        strokeWidth: 2
      });
      break;
    case 'circle':
      element = new ShapeElement({
        x: x - 50,
        y: y - 50,
        width: 100,
        height: 100,
        shapeType: 'circle',
        fill: '#f3e5f5',
        stroke: '#9c27b0',
        strokeWidth: 2
      });
      break;
    case 'triangle':
      element = new ShapeElement({
        x: x - 50,
        y: y - 50,
        width: 100,
        height: 100,
        shapeType: 'triangle',
        fill: '#e8f5e9',
        stroke: '#4caf50',
        strokeWidth: 2
      });
      break;
    default:
      return;
  }
  
  canvas.addElement(element);
  canvas.selectElement(element);
}

/**
 * Add example elements to the canvas for testing
 * @param {Canvas} canvas - The canvas instance
 */
function addExampleElements(canvas) {
  // Add a text element
  const textElement = new TextElement({
    x: 100,
    y: 100,
    text: 'Hello, World!',
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 'transparent',
    stroke: '#000000'
  });
  canvas.addElement(textElement);
  
  // Add a rectangle shape
  const rectElement = new ShapeElement({
    x: 200,
    y: 200,
    width: 150,
    height: 100,
    shapeType: 'rect',
    fill: '#e0f7fa',
    stroke: '#0097a7',
    strokeWidth: 2
  });
  canvas.addElement(rectElement);
  
  // Add a circle shape
  const circleElement = new ShapeElement({
    x: 400,
    y: 150,
    width: 100,
    height: 100,
    shapeType: 'circle',
    fill: '#f3e5f5',
    stroke: '#9c27b0',
    strokeWidth: 2
  });
  canvas.addElement(circleElement);
}