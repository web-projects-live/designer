/**
 * Canvas Class
 * Manages the canvas element and handles element manipulation
 */
import EventHandlers from '../utils/eventHandlers.js';

class Canvas {
  /**
   * Create a new Canvas instance
   * @param {HTMLCanvasElement} canvasElement - The canvas DOM element
   * @param {Object} options - Canvas options
   */
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    // Canvas properties
    this.width = options.width || this.canvas.width;
    this.height = options.height || this.canvas.height;
    this.backgroundColor = options.backgroundColor || '#ffffff';
    
    // Elements on the canvas
    this.elements = [];
    
    // Selection state
    this.selectedElement = null;
    this.isDragging = false;
    this.isResizing = false;
    this.currentResizeHandle = null;
    
    // Mouse state
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Initial render
    this.render();
  }

  /**
   * Initialize event listeners for canvas interactions
   */
  initEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Prevent context menu on right-click
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * Handle mouse down event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseDown(event) {
    event.preventDefault();
    
    const normalizedEvent = EventHandlers.createStandardizedEvent(event, this.canvas);
    this.mouseX = normalizedEvent.x;
    this.mouseY = normalizedEvent.y;
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
    
    // Check if clicking on a resize handle of the selected element
    if (this.selectedElement) {
      const handle = this.selectedElement.getResizeHandleAt(this.mouseX, this.mouseY);
      if (handle) {
        this.isResizing = true;
        this.currentResizeHandle = handle;
        this.selectedElement.startResize(handle, this.mouseX, this.mouseY);
        return;
      }
    }
    
    // Check if clicking on an element
    const clickedElement = this.getElementAt(this.mouseX, this.mouseY);
    
    if (clickedElement) {
      // Select the clicked element
      this.selectElement(clickedElement);
      
      // Start dragging the element
      this.isDragging = true;
      this.selectedElement.startDrag(this.mouseX, this.mouseY);
    } else {
      // Clicked on empty space, deselect current element
      this.deselectElement();
    }
    
    // Trigger render
    this.render();
  }

  /**
   * Handle mouse move event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseMove(event) {
    const normalizedEvent = EventHandlers.createStandardizedEvent(event, this.canvas);
    this.mouseX = normalizedEvent.x;
    this.mouseY = normalizedEvent.y;
    
    // Update cursor style based on hover state
    this.updateCursor();
    
    // Handle resizing
    if (this.isResizing && this.selectedElement) {
      this.selectedElement.resize(
        this.mouseX, 
        this.mouseY, 
        normalizedEvent.shiftKey // Maintain aspect ratio if shift key is pressed
      );
      this.render();
      return;
    }
    
    // Handle dragging
    if (this.isDragging && this.selectedElement) {
      this.selectedElement.drag(this.mouseX, this.mouseY, {
        width: this.width,
        height: this.height
      });
      this.render();
    }
    
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
  }

  /**
   * Handle mouse up event
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseUp(event) {
    if (this.isResizing && this.selectedElement) {
      this.selectedElement.endResize();
      this.isResizing = false;
      this.currentResizeHandle = null;
    }
    
    if (this.isDragging && this.selectedElement) {
      this.selectedElement.endDrag();
      this.isDragging = false;
    }
    
    // Update cursor
    this.updateCursor();
  }

  /**
   * Handle touch start event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchStart(event) {
    event.preventDefault(); // Prevent scrolling
    
    const normalizedEvent = EventHandlers.createStandardizedEvent(event, this.canvas);
    this.mouseX = normalizedEvent.x;
    this.mouseY = normalizedEvent.y;
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
    
    // Check if touching a resize handle of the selected element
    if (this.selectedElement) {
      const handle = this.selectedElement.getResizeHandleAt(this.mouseX, this.mouseY);
      if (handle) {
        this.isResizing = true;
        this.currentResizeHandle = handle;
        this.selectedElement.startResize(handle, this.mouseX, this.mouseY);
        return;
      }
    }
    
    // Check if touching an element
    const touchedElement = this.getElementAt(this.mouseX, this.mouseY);
    
    if (touchedElement) {
      // Select the touched element
      this.selectElement(touchedElement);
      
      // Start dragging the element
      this.isDragging = true;
      this.selectedElement.startDrag(this.mouseX, this.mouseY);
    } else {
      // Touched on empty space, deselect current element
      this.deselectElement();
    }
    
    // Trigger render
    this.render();
  }

  /**
   * Handle touch move event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchMove(event) {
    event.preventDefault(); // Prevent scrolling
    
    const normalizedEvent = EventHandlers.createStandardizedEvent(event, this.canvas);
    this.mouseX = normalizedEvent.x;
    this.mouseY = normalizedEvent.y;
    
    // Handle resizing
    if (this.isResizing && this.selectedElement) {
      this.selectedElement.resize(this.mouseX, this.mouseY);
      this.render();
      return;
    }
    
    // Handle dragging
    if (this.isDragging && this.selectedElement) {
      this.selectedElement.drag(this.mouseX, this.mouseY, {
        width: this.width,
        height: this.height
      });
      this.render();
    }
    
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
  }

  /**
   * Handle touch end event
   * @param {TouchEvent} event - Touch event
   */
  handleTouchEnd(event) {
    if (this.isResizing && this.selectedElement) {
      this.selectedElement.endResize();
      this.isResizing = false;
      this.currentResizeHandle = null;
    }
    
    if (this.isDragging && this.selectedElement) {
      this.selectedElement.endDrag();
      this.isDragging = false;
    }
  }

  /**
   * Update cursor style based on current hover state
   */
  updateCursor() {
    if (this.isResizing) {
      // Keep the resize cursor during resize operation
      return;
    }
    
    if (this.selectedElement) {
      const cursorStyle = this.selectedElement.getCursorStyle(this.mouseX, this.mouseY);
      this.canvas.style.cursor = cursorStyle;
    } else {
      // Check if hovering over any element
      const hoveredElement = this.getElementAt(this.mouseX, this.mouseY);
      this.canvas.style.cursor = hoveredElement ? 'pointer' : 'default';
    }
  }

  /**
   * Get the element at the specified coordinates
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {BaseElement|null} The element at the coordinates or null
   */
  getElementAt(x, y) {
    // Check elements in reverse order (top to bottom in z-index)
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const element = this.elements[i];
      if (element.containsPoint(x, y)) {
        return element;
      }
    }
    return null;
  }

  /**
   * Select an element
   * @param {BaseElement} element - Element to select
   */
  selectElement(element) {
    // Deselect current element if any
    if (this.selectedElement && this.selectedElement !== element) {
      this.selectedElement.setSelected(false);
    }
    
    // Select new element
    this.selectedElement = element;
    this.selectedElement.setSelected(true);
    
    // Move selected element to top of stack
    this.bringToFront(element);
    
    // Trigger custom event
    this.canvas.dispatchEvent(new CustomEvent('element:selected', {
      detail: { element }
    }));
  }

  /**
   * Deselect the currently selected element
   */
  deselectElement() {
    if (this.selectedElement) {
      this.selectedElement.setSelected(false);
      this.selectedElement = null;
      
      // Trigger custom event
      this.canvas.dispatchEvent(new CustomEvent('element:deselected'));
    }
  }

  /**
   * Bring an element to the front (top of z-index)
   * @param {BaseElement} element - Element to bring to front
   */
  bringToFront(element) {
    const index = this.elements.indexOf(element);
    if (index !== -1) {
      this.elements.splice(index, 1);
      this.elements.push(element);
    }
  }

  /**
   * Add an element to the canvas
   * @param {BaseElement} element - Element to add
   */
  addElement(element) {
    this.elements.push(element);
    this.render();
    
    // Trigger custom event
    this.canvas.dispatchEvent(new CustomEvent('element:added', {
      detail: { element }
    }));
  }

  /**
   * Remove an element from the canvas
   * @param {BaseElement} element - Element to remove
   */
  removeElement(element) {
    const index = this.elements.indexOf(element);
    if (index !== -1) {
      this.elements.splice(index, 1);
      
      // If removing selected element, deselect it
      if (this.selectedElement === element) {
        this.deselectElement();
      }
      
      this.render();
      
      // Trigger custom event
      this.canvas.dispatchEvent(new CustomEvent('element:removed', {
        detail: { element }
      }));
    }
  }

  /**
   * Remove all elements from the canvas
   */
  clearElements() {
    this.elements = [];
    this.deselectElement();
    this.render();
    
    // Trigger custom event
    this.canvas.dispatchEvent(new CustomEvent('canvas:cleared'));
  }

  /**
   * Render the canvas and all elements
   */
  render() {
    // Clear canvas
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Render all elements
    for (const element of this.elements) {
      element.render(this.ctx);
    }
  }

  /**
   * Resize the canvas
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
    
    // Trigger custom event
    this.canvas.dispatchEvent(new CustomEvent('canvas:resized', {
      detail: { width, height }
    }));
  }

  /**
   * Get the currently selected element
   * @returns {BaseElement|null} The selected element or null
   */
  getSelectedElement() {
    return this.selectedElement;
  }

  /**
   * Get all elements on the canvas
   * @returns {Array} Array of elements
   */
  getAllElements() {
    return [...this.elements];
  }

  /**
   * Set the background color of the canvas
   * @param {string} color - Background color
   */
  setBackgroundColor(color) {
    this.backgroundColor = color;
    this.render();
  }
}

export default Canvas;