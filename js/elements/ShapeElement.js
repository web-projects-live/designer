/**
 * ShapeElement Class
 * Represents a shape element on the canvas with manipulation capabilities
 */
import BaseElement from './BaseElement.js';

class ShapeElement extends BaseElement {
  /**
   * Create a new ShapeElement
   * @param {Object} options - Element options
   * @param {string} options.shapeType - Type of shape (rect, circle, triangle, etc.)
   * @param {boolean} options.fillEnabled - Whether fill is enabled
   * @param {boolean} options.strokeEnabled - Whether stroke is enabled
   */
  constructor(options = {}) {
    super(options);
    
    this.type = 'shape';
    this.shapeType = options.shapeType || 'rect';
    this.fillEnabled = options.fillEnabled !== undefined ? options.fillEnabled : true;
    this.strokeEnabled = options.strokeEnabled !== undefined ? options.strokeEnabled : true;
    this.cornerRadius = options.cornerRadius || 0; // For rounded rectangles
  }

  /**
   * Render the shape element on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  render(ctx) {
    ctx.save();
    
    // Set styles
    if (this.fillEnabled) {
      ctx.fillStyle = this.fill;
    }
    
    if (this.strokeEnabled) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.strokeWidth;
    }
    
    // Draw shape based on type
    switch (this.shapeType) {
      case 'rect':
        this.drawRectangle(ctx);
        break;
      case 'roundedRect':
        this.drawRoundedRectangle(ctx);
        break;
      case 'circle':
        this.drawCircle(ctx);
        break;
      case 'ellipse':
        this.drawEllipse(ctx);
        break;
      case 'triangle':
        this.drawTriangle(ctx);
        break;
      case 'line':
        this.drawLine(ctx);
        break;
      case 'arrow':
        this.drawArrow(ctx);
        break;
      default:
        this.drawRectangle(ctx);
    }
    
    ctx.restore();
    
    // Render selection if selected
    if (this.selected) {
      this.renderSelection(ctx);
    }
  }

  /**
   * Draw a rectangle
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawRectangle(ctx) {
    if (this.fillEnabled) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    if (this.strokeEnabled) {
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draw a rounded rectangle
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawRoundedRectangle(ctx) {
    const radius = Math.min(this.cornerRadius, Math.min(this.width, this.height) / 2);
    
    ctx.beginPath();
    ctx.moveTo(this.x + radius, this.y);
    ctx.lineTo(this.x + this.width - radius, this.y);
    ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + radius, radius);
    ctx.lineTo(this.x + this.width, this.y + this.height - radius);
    ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height, radius);
    ctx.lineTo(this.x + radius, this.y + this.height);
    ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - radius, radius);
    ctx.lineTo(this.x, this.y + radius);
    ctx.arcTo(this.x, this.y, this.x + radius, this.y, radius);
    ctx.closePath();
    
    if (this.fillEnabled) {
      ctx.fill();
    }
    
    if (this.strokeEnabled) {
      ctx.stroke();
    }
  }

  /**
   * Draw a circle
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawCircle(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = Math.min(this.width, this.height) / 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    
    if (this.fillEnabled) {
      ctx.fill();
    }
    
    if (this.strokeEnabled) {
      ctx.stroke();
    }
  }

  /**
   * Draw an ellipse
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawEllipse(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radiusX = this.width / 2;
    const radiusY = this.height / 2;
    
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.closePath();
    
    if (this.fillEnabled) {
      ctx.fill();
    }
    
    if (this.strokeEnabled) {
      ctx.stroke();
    }
  }

  /**
   * Draw a triangle
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawTriangle(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.closePath();
    
    if (this.fillEnabled) {
      ctx.fill();
    }
    
    if (this.strokeEnabled) {
      ctx.stroke();
    }
  }

  /**
   * Draw a line
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawLine(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    
    if (this.strokeEnabled) {
      ctx.stroke();
    }
  }

  /**
   * Draw an arrow
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawArrow(ctx) {
    const headLength = Math.min(20, Math.min(this.width, this.height) / 3);
    const angle = Math.atan2(this.height, this.width);
    
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.stroke();
    
    // Draw the arrow head
    ctx.beginPath();
    ctx.moveTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(
      this.x + this.width - headLength * Math.cos(angle - Math.PI / 6),
      this.y + this.height - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      this.x + this.width - headLength * Math.cos(angle + Math.PI / 6),
      this.y + this.height - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    
    if (this.fillEnabled) {
      ctx.fill();
    }
    
    if (this.strokeEnabled) {
      ctx.stroke();
    }
  }

  /**
   * Check if a point is inside this shape element
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @returns {boolean} True if point is inside element
   */
  containsPoint(x, y) {
    // For most shapes, we can use the bounding box
    if (this.shapeType === 'rect' || this.shapeType === 'roundedRect') {
      return super.containsPoint(x, y);
    }
    
    // For circle, check distance from center
    if (this.shapeType === 'circle') {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      const radius = Math.min(this.width, this.height) / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      return distance <= radius;
    }
    
    // For ellipse, normalize the coordinates
    if (this.shapeType === 'ellipse') {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      const normalizedX = (x - centerX) / (this.width / 2);
      const normalizedY = (y - centerY) / (this.height / 2);
      return Math.pow(normalizedX, 2) + Math.pow(normalizedY, 2) <= 1;
    }
    
    // For triangle, use point-in-triangle algorithm
    if (this.shapeType === 'triangle') {
      const p1 = { x: this.x + this.width / 2, y: this.y };
      const p2 = { x: this.x + this.width, y: this.y + this.height };
      const p3 = { x: this.x, y: this.y + this.height };
      
      return this.pointInTriangle(x, y, p1, p2, p3);
    }
    
    // For line and arrow, check if point is near the line
    if (this.shapeType === 'line' || this.shapeType === 'arrow') {
      return this.pointNearLine(x, y, this.x, this.y, this.x + this.width, this.y + this.height, 5);
    }
    
    // Default to bounding box check
    return super.containsPoint(x, y);
  }

  /**
   * Check if a point is inside a triangle
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @param {Object} p1 - First triangle point
   * @param {Object} p2 - Second triangle point
   * @param {Object} p3 - Third triangle point
   * @returns {boolean} True if point is inside triangle
   */
  pointInTriangle(x, y, p1, p2, p3) {
    const area = 0.5 * Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y))
    );
    
    const area1 = 0.5 * Math.abs(
      (x * (p2.y - p3.y) + p2.x * (p3.y - y) + p3.x * (y - p2.y))
    );
    
    const area2 = 0.5 * Math.abs(
      (p1.x * (y - p3.y) + x * (p3.y - p1.y) + p3.x * (p1.y - y))
    );
    
    const area3 = 0.5 * Math.abs(
      (p1.x * (p2.y - y) + p2.x * (y - p1.y) + x * (p1.y - p2.y))
    );
    
    return Math.abs(area - (area1 + area2 + area3)) < 0.01;
  }

  /**
   * Check if a point is near a line
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @param {number} x1 - Line start x coordinate
   * @param {number} y1 - Line start y coordinate
   * @param {number} x2 - Line end x coordinate
   * @param {number} y2 - Line end y coordinate
   * @param {number} threshold - Distance threshold
   * @returns {boolean} True if point is near the line
   */
  pointNearLine(x, y, x1, y1, x2, y2, threshold = 5) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    
    return Math.sqrt(dx * dx + dy * dy) < threshold;
  }

  /**
   * Check if element is selected
   * @returns {boolean} Whether element is selected
   */
  isSelected() {
    return this.selected;
  }

  /**
   * Clone this shape element
   * @returns {ShapeElement} A new instance with the same properties
   */
  clone() {
    return new ShapeElement({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      shapeType: this.shapeType,
      fillEnabled: this.fillEnabled,
      strokeEnabled: this.strokeEnabled,
      cornerRadius: this.cornerRadius
    });
  }

  /**
   * Get properties for the properties panel
   * @returns {Object} Properties object
   */
  getProperties() {
    return {
      ...super.getProperties(),
      shapeType: this.shapeType,
      fillEnabled: this.fillEnabled,
      strokeEnabled: this.strokeEnabled,
      cornerRadius: this.cornerRadius
    };
  }

  /**
   * Update element properties
   * @param {Object} properties - New properties
   */
  updateProperties(properties) {
    super.updateProperties(properties);
    
    if (properties.shapeType !== undefined) this.shapeType = properties.shapeType;
    if (properties.fillEnabled !== undefined) this.fillEnabled = properties.fillEnabled;
    if (properties.strokeEnabled !== undefined) this.strokeEnabled = properties.strokeEnabled;
    if (properties.cornerRadius !== undefined) this.cornerRadius = properties.cornerRadius;
  }
}

export default ShapeElement;