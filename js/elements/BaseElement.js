/**
 * BaseElement Class
 * Base class for all canvas elements with selection, dragging, and resizing capabilities
 */
class BaseElement {
  /**
   * Create a new BaseElement
   * @param {Object} options - Element options
   * @param {number} options.x - X position
   * @param {number} options.y - Y position
   * @param {number} options.width - Element width
   * @param {number} options.height - Element height
   * @param {string} options.fill - Fill color
   * @param {string} options.stroke - Stroke color
   * @param {number} options.strokeWidth - Stroke width
   */
  constructor(options = {}) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.fill = options.fill || '#ffffff';
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 1;
    this.id = options.id || `element_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Selection state
    this.selected = false;
    this.dragging = false;
    this.resizing = false;
    this.resizeHandle = null;
    
    // Drag offset
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    
    // Resize handles (8 handles: top-left, top, top-right, right, bottom-right, bottom, bottom-left, left)
    this.resizeHandles = {
      tl: { cursor: 'nwse-resize' },
      t: { cursor: 'ns-resize' },
      tr: { cursor: 'nesw-resize' },
      r: { cursor: 'ew-resize' },
      br: { cursor: 'nwse-resize' },
      b: { cursor: 'ns-resize' },
      bl: { cursor: 'nesw-resize' },
      l: { cursor: 'ew-resize' }
    };
    
    // Handle size
    this.handleSize = 8;
  }

  /**
   * Check if a point is inside this element
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @returns {boolean} True if point is inside element
   */
  containsPoint(x, y) {
    return x >= this.x && 
           x <= this.x + this.width && 
           y >= this.y && 
           y <= this.y + this.height;
  }

  /**
   * Set selection state
   * @param {boolean} selected - Whether element is selected
   */
  setSelected(selected) {
    this.selected = selected;
  }

  /**
   * Check if element is selected
   * @returns {boolean} Whether element is selected
   */
  isSelected() {
    return this.selected;
  }

  /**
   * Start dragging the element
   * @param {number} x - Mouse/touch x coordinate
   * @param {number} y - Mouse/touch y coordinate
   */
  startDrag(x, y) {
    this.dragging = true;
    this.dragOffsetX = x - this.x;
    this.dragOffsetY = y - this.y;
  }

  /**
   * Update element position during drag
   * @param {number} x - Current mouse/touch x coordinate
   * @param {number} y - Current mouse/touch y coordinate
   * @param {Object} bounds - Canvas bounds to constrain element
   */
  drag(x, y, bounds = null) {
    if (!this.dragging) return;
    
    let newX = x - this.dragOffsetX;
    let newY = y - this.dragOffsetY;
    
    // Apply bounds constraints if provided
    if (bounds) {
      newX = Math.max(0, Math.min(bounds.width - this.width, newX));
      newY = Math.max(0, Math.min(bounds.height - this.height, newY));
    }
    
    this.x = newX;
    this.y = newY;
  }

  /**
   * End dragging operation
   */
  endDrag() {
    this.dragging = false;
  }

  /**
   * Calculate and update resize handle positions
   */
  updateResizeHandles() {
    const { x, y, width, height } = this;
    
    // Update handle positions
    this.resizeHandles.tl.x = x;
    this.resizeHandles.tl.y = y;
    
    this.resizeHandles.t.x = x + width / 2;
    this.resizeHandles.t.y = y;
    
    this.resizeHandles.tr.x = x + width;
    this.resizeHandles.tr.y = y;
    
    this.resizeHandles.r.x = x + width;
    this.resizeHandles.r.y = y + height / 2;
    
    this.resizeHandles.br.x = x + width;
    this.resizeHandles.br.y = y + height;
    
    this.resizeHandles.b.x = x + width / 2;
    this.resizeHandles.b.y = y + height;
    
    this.resizeHandles.bl.x = x;
    this.resizeHandles.bl.y = y + height;
    
    this.resizeHandles.l.x = x;
    this.resizeHandles.l.y = y + height / 2;
  }

  /**
   * Check if a point is inside any resize handle
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @returns {string|null} Handle key if found, null otherwise
   */
  getResizeHandleAt(x, y) {
    if (!this.selected) return null;
    
    this.updateResizeHandles();
    
    for (const [key, handle] of Object.entries(this.resizeHandles)) {
      const handleX = handle.x;
      const handleY = handle.y;
      
      if (x >= handleX - this.handleSize / 2 && 
          x <= handleX + this.handleSize / 2 && 
          y >= handleY - this.handleSize / 2 && 
          y <= handleY + this.handleSize / 2) {
        return key;
      }
    }
    
    return null;
  }

  /**
   * Start resizing the element
   * @param {string} handleKey - Key of the handle being dragged
   * @param {number} x - Mouse/touch x coordinate
   * @param {number} y - Mouse/touch y coordinate
   */
  startResize(handleKey, x, y) {
    this.resizing = true;
    this.resizeHandle = handleKey;
    this.originalWidth = this.width;
    this.originalHeight = this.height;
    this.originalX = this.x;
    this.originalY = this.y;
    this.resizeStartX = x;
    this.resizeStartY = y;
  }

  /**
   * Update element dimensions during resize
   * @param {number} x - Current mouse/touch x coordinate
   * @param {number} y - Current mouse/touch y coordinate
   * @param {boolean} maintainAspectRatio - Whether to maintain aspect ratio
   */
  resize(x, y, maintainAspectRatio = false) {
    if (!this.resizing) return;
    
    const deltaX = x - this.resizeStartX;
    const deltaY = y - this.resizeStartY;
    
    let newX = this.originalX;
    let newY = this.originalY;
    let newWidth = this.originalWidth;
    let newHeight = this.originalHeight;
    
    const aspectRatio = this.originalWidth / this.originalHeight;
    
    switch (this.resizeHandle) {
      case 'tl': // Top-left
        newX = this.originalX + deltaX;
        newY = this.originalY + deltaY;
        newWidth = this.originalWidth - deltaX;
        newHeight = this.originalHeight - deltaY;
        break;
      case 't': // Top
        newY = this.originalY + deltaY;
        newHeight = this.originalHeight - deltaY;
        break;
      case 'tr': // Top-right
        newY = this.originalY + deltaY;
        newWidth = this.originalWidth + deltaX;
        newHeight = this.originalHeight - deltaY;
        break;
      case 'r': // Right
        newWidth = this.originalWidth + deltaX;
        break;
      case 'br': // Bottom-right
        newWidth = this.originalWidth + deltaX;
        newHeight = this.originalHeight + deltaY;
        break;
      case 'b': // Bottom
        newHeight = this.originalHeight + deltaY;
        break;
      case 'bl': // Bottom-left
        newX = this.originalX + deltaX;
        newWidth = this.originalWidth - deltaX;
        newHeight = this.originalHeight + deltaY;
        break;
      case 'l': // Left
        newX = this.originalX + deltaX;
        newWidth = this.originalWidth - deltaX;
        break;
    }
    
    // Ensure minimum size
    if (newWidth < 10) {
      newWidth = 10;
      newX = this.resizeHandle.includes('l') ? this.originalX + this.originalWidth - 10 : this.originalX;
    }
    
    if (newHeight < 10) {
      newHeight = 10;
      newY = this.resizeHandle.includes('t') ? this.originalY + this.originalHeight - 10 : this.originalY;
    }
    
    // Apply aspect ratio if needed
    if (maintainAspectRatio) {
      if (this.resizeHandle.includes('t') || this.resizeHandle.includes('b')) {
        newWidth = newHeight * aspectRatio;
        if (this.resizeHandle.includes('l')) {
          newX = this.originalX + this.originalWidth - newWidth;
        }
      } else {
        newHeight = newWidth / aspectRatio;
        if (this.resizeHandle.includes('t')) {
          newY = this.originalY + this.originalHeight - newHeight;
        }
      }
    }
    
    this.x = newX;
    this.y = newY;
    this.width = newWidth;
    this.height = newHeight;
  }

  /**
   * End resizing operation
   */
  endResize() {
    this.resizing = false;
    this.resizeHandle = null;
  }

  /**
   * Get cursor style based on mouse position
   * @param {number} x - Mouse x coordinate
   * @param {number} y - Mouse y coordinate
   * @returns {string} Cursor style
   */
  getCursorStyle(x, y) {
    if (!this.selected) return 'default';
    
    const handle = this.getResizeHandleAt(x, y);
    if (handle) {
      return this.resizeHandles[handle].cursor;
    }
    
    return this.containsPoint(x, y) ? 'move' : 'default';
  }

  /**
   * Render the element on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  render(ctx) {
    // Base rendering - to be overridden by subclasses
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWidth;
    
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Render selection if selected
    if (this.selected) {
      this.renderSelection(ctx);
    }
  }

  /**
   * Render selection indicators and resize handles
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  renderSelection(ctx) {
    // Draw selection outline
    ctx.save();
    ctx.strokeStyle = '#4285f4';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    ctx.restore();
    
    // Draw resize handles
    this.updateResizeHandles();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#4285f4';
    ctx.lineWidth = 1;
    
    for (const handle of Object.values(this.resizeHandles)) {
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, this.handleSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   * Get properties for the properties panel
   * @returns {Object} Properties object
   */
  getProperties() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth
    };
  }

  /**
   * Update element properties
   * @param {Object} properties - New properties
   */
  updateProperties(properties) {
    if (properties.x !== undefined) this.x = properties.x;
    if (properties.y !== undefined) this.y = properties.y;
    if (properties.width !== undefined) this.width = properties.width;
    if (properties.height !== undefined) this.height = properties.height;
    if (properties.fill !== undefined) this.fill = properties.fill;
    if (properties.stroke !== undefined) this.stroke = properties.stroke;
    if (properties.strokeWidth !== undefined) this.strokeWidth = properties.strokeWidth;
  }
}

export default BaseElement;