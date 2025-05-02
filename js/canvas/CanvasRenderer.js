/**
 * CanvasRenderer Class
 * Handles rendering logic for the canvas and its elements
 */
class CanvasRenderer {
  /**
   * Create a new CanvasRenderer
   * @param {Canvas} canvas - The Canvas instance to render
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.ctx;
    this.width = canvas.width;
    this.height = canvas.height;
    this.backgroundColor = canvas.backgroundColor;
    this.elements = canvas.elements;
  }

  /**
   * Render the entire canvas and all elements
   */
  render() {
    this.clear();
    this.renderBackground();
    this.renderElements();
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Render the canvas background
   */
  renderBackground() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Render all elements on the canvas
   */
  renderElements() {
    // Render all elements
    for (const element of this.elements) {
      this.renderElement(element);
    }
  }

  /**
   * Render a single element
   * @param {BaseElement} element - The element to render
   */
  renderElement(element) {
    // Save context state
    this.ctx.save();
    
    // Render the element
    element.render(this.ctx);
    
    // Restore context state
    this.ctx.restore();
  }

  /**
   * Render selection indicators for an element
   * @param {BaseElement} element - The selected element
   */
  renderSelectionIndicators(element) {
    // Draw selection outline
    this.ctx.save();
    this.ctx.strokeStyle = '#4285f4';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 3]);
    this.ctx.strokeRect(
      element.x - 2,
      element.y - 2,
      element.width + 4,
      element.height + 4
    );
    this.ctx.restore();
  }

  /**
   * Render resize handles for an element
   * @param {BaseElement} element - The selected element
   */
  renderResizeHandles(element) {
    const handleSize = element.handleSize || 8;
    
    // Update handle positions
    element.updateResizeHandles();
    
    // Draw resize handles
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.strokeStyle = '#4285f4';
    this.ctx.lineWidth = 1;
    
    for (const handle of Object.values(element.resizeHandles)) {
      this.ctx.beginPath();
      this.ctx.arc(handle.x, handle.y, handleSize / 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  /**
   * Update the renderer with new canvas properties
   * @param {Object} properties - New properties
   */
  update(properties) {
    if (properties.width !== undefined) this.width = properties.width;
    if (properties.height !== undefined) this.height = properties.height;
    if (properties.backgroundColor !== undefined) this.backgroundColor = properties.backgroundColor;
    if (properties.elements !== undefined) this.elements = properties.elements;
    if (properties.ctx !== undefined) this.ctx = properties.ctx;
  }

  /**
   * Render a grid on the canvas (for alignment)
   * @param {number} gridSize - Size of grid cells
   * @param {string} gridColor - Color of grid lines
   */
  renderGrid(gridSize = 20, gridColor = 'rgba(0, 0, 0, 0.1)') {
    this.ctx.save();
    this.ctx.strokeStyle = gridColor;
    this.ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = gridSize; x < this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = gridSize; y < this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  /**
   * Render a snapshot of the canvas without selection indicators
   * @returns {HTMLCanvasElement} A canvas element with the rendered snapshot
   */
  renderSnapshot() {
    // Create a new canvas for the snapshot
    const snapshotCanvas = document.createElement('canvas');
    snapshotCanvas.width = this.width;
    snapshotCanvas.height = this.height;
    const snapshotCtx = snapshotCanvas.getContext('2d');
    
    // Draw background
    snapshotCtx.fillStyle = this.backgroundColor;
    snapshotCtx.fillRect(0, 0, this.width, this.height);
    
    // Draw all elements without selection indicators
    for (const element of this.elements) {
      // Temporarily set selected to false
      const wasSelected = element.selected;
      element.selected = false;
      
      // Save context state
      snapshotCtx.save();
      
      // Render the element
      element.render(snapshotCtx);
      
      // Restore context state
      snapshotCtx.restore();
      
      // Restore selection state
      element.selected = wasSelected;
    }
    
    return snapshotCanvas;
  }

  /**
   * Get a data URL of the current canvas state
   * @param {string} type - Image type (e.g., 'image/png', 'image/jpeg')
   * @param {number} quality - Image quality for JPEG (0-1)
   * @returns {string} Data URL of the canvas
   */
  toDataURL(type = 'image/png', quality = 0.92) {
    const snapshotCanvas = this.renderSnapshot();
    return snapshotCanvas.toDataURL(type, quality);
  }
}

export default CanvasRenderer;