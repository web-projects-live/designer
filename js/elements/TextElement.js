/**
 * TextElement Class
 * Represents a text element on the canvas with manipulation capabilities
 */
import BaseElement from './BaseElement.js';

class TextElement extends BaseElement {
  /**
   * Create a new TextElement
   * @param {Object} options - Element options
   * @param {string} options.text - Text content
   * @param {string} options.fontFamily - Font family
   * @param {number} options.fontSize - Font size in pixels
   * @param {string} options.fontWeight - Font weight (normal, bold, etc.)
   * @param {string} options.textAlign - Text alignment (left, center, right)
   */
  constructor(options = {}) {
    super(options);
    
    this.type = 'text';
    this.text = options.text || 'Text Element';
    this.fontFamily = options.fontFamily || 'Arial';
    this.fontSize = options.fontSize || 16;
    this.fontWeight = options.fontWeight || 'normal';
    this.textAlign = options.textAlign || 'left';
    this.lineHeight = options.lineHeight || 1.2;
    
    // Calculate initial dimensions based on text
    this.calculateDimensions();
  }

  /**
   * Calculate text dimensions based on content and font settings
   * @param {CanvasRenderingContext2D} [ctx] - Canvas context for measurement
   */
  calculateDimensions(ctx) {
    if (!ctx) {
      // Create temporary canvas for measurement if no context provided
      const canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
    }
    
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    
    // Split text into lines
    const lines = this.text.split('\n');
    let maxWidth = 0;
    
    // Find the widest line
    for (const line of lines) {
      const metrics = ctx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    }
    
    // Set dimensions based on text measurement
    this.width = Math.max(this.width, maxWidth + 10); // Add padding
    this.height = Math.max(this.height, lines.length * this.fontSize * this.lineHeight + 10); // Add padding
  }

  /**
   * Render the text element on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  render(ctx) {
    // Recalculate dimensions if needed
    this.calculateDimensions(ctx);
    
    // Draw background if fill color is set
    if (this.fill && this.fill !== 'transparent') {
      ctx.fillStyle = this.fill;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    // Draw text
    ctx.fillStyle = this.stroke; // Use stroke color for text
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.textBaseline = 'top';
    
    // Set text alignment
    let textX = this.x + 5; // Default left alignment with padding
    if (this.textAlign === 'center') {
      ctx.textAlign = 'center';
      textX = this.x + this.width / 2;
    } else if (this.textAlign === 'right') {
      ctx.textAlign = 'right';
      textX = this.x + this.width - 5;
    } else {
      ctx.textAlign = 'left';
    }
    
    // Draw each line of text
    const lines = this.text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineY = this.y + 5 + (i * this.fontSize * this.lineHeight);
      ctx.fillText(line, textX, lineY);
    }
    
    // Draw border if stroke is set
    if (this.stroke && this.strokeWidth > 0) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    // Render selection if selected
    if (this.selected) {
      this.renderSelection(ctx);
    }
  }

  /**
   * Check if a point is inside this text element
   * Takes into account the actual text bounds
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @returns {boolean} True if point is inside element
   */
  containsPoint(x, y) {
    // Use the base implementation for now
    // Could be enhanced to check actual text bounds
    return super.containsPoint(x, y);
  }

  /**
   * Check if element is selected
   * @returns {boolean} Whether element is selected
   */
  isSelected() {
    return this.selected;
  }

  /**
   * Clone this text element
   * @returns {TextElement} A new instance with the same properties
   */
  clone() {
    return new TextElement({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      text: this.text,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      textAlign: this.textAlign,
      lineHeight: this.lineHeight
    });
  }

  /**
   * Get properties for the properties panel
   * @returns {Object} Properties object
   */
  getProperties() {
    return {
      ...super.getProperties(),
      text: this.text,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      textAlign: this.textAlign,
      lineHeight: this.lineHeight
    };
  }

  /**
   * Update element properties
   * @param {Object} properties - New properties
   */
  updateProperties(properties) {
    super.updateProperties(properties);
    
    if (properties.text !== undefined) this.text = properties.text;
    if (properties.fontFamily !== undefined) this.fontFamily = properties.fontFamily;
    if (properties.fontSize !== undefined) this.fontSize = properties.fontSize;
    if (properties.fontWeight !== undefined) this.fontWeight = properties.fontWeight;
    if (properties.textAlign !== undefined) this.textAlign = properties.textAlign;
    if (properties.lineHeight !== undefined) this.lineHeight = properties.lineHeight;
    
    // Recalculate dimensions after property changes
    this.calculateDimensions();
  }
}

export default TextElement;