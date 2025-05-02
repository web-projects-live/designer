/**
 * Event Handlers Utility
 * Provides utility functions for handling mouse and touch events in the canvas editor
 */

class EventHandlers {
  /**
   * Normalizes mouse and touch event data to provide consistent coordinates
   * @param {Event} event - The original mouse or touch event
   * @param {HTMLElement} element - The element relative to which coordinates should be calculated
   * @returns {Object} Normalized event data with x, y coordinates
   */
  static getNormalizedEventCoords(event, element) {
    const rect = element.getBoundingClientRect();
    let x, y;
    
    // Handle both touch and mouse events
    if (event.touches && event.touches.length > 0) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }
    
    return { x, y };
  }

  /**
   * Checks if a point is inside a rectangle
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @param {number} rectX - Rectangle x coordinate
   * @param {number} rectY - Rectangle y coordinate
   * @param {number} rectWidth - Rectangle width
   * @param {number} rectHeight - Rectangle height
   * @returns {boolean} True if point is inside rectangle
   */
  static isPointInRect(x, y, rectX, rectY, rectWidth, rectHeight) {
    return x >= rectX && 
           x <= rectX + rectWidth && 
           y >= rectY && 
           y <= rectY + rectHeight;
  }

  /**
   * Checks if a point is near a line (for edge selection)
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @param {number} x1 - Line start x coordinate
   * @param {number} y1 - Line start y coordinate
   * @param {number} x2 - Line end x coordinate
   * @param {number} y2 - Line end y coordinate
   * @param {number} threshold - Distance threshold
   * @returns {boolean} True if point is near the line
   */
  static isPointNearLine(x, y, x1, y1, x2, y2, threshold = 5) {
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
   * Calculates the distance between two points
   * @param {number} x1 - First point x coordinate
   * @param {number} y1 - First point y coordinate
   * @param {number} x2 - Second point x coordinate
   * @param {number} y2 - Second point y coordinate
   * @returns {number} Distance between points
   */
  static getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  /**
   * Determines if a point is inside a resize handle
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @param {Object} handle - Handle position and size
   * @returns {boolean} True if point is inside handle
   */
  static isPointInHandle(x, y, handle) {
    return this.isPointInRect(
      x, y, 
      handle.x - handle.size / 2, 
      handle.y - handle.size / 2, 
      handle.size, 
      handle.size
    );
  }

  /**
   * Prevents default behavior for an event
   * @param {Event} event - The event to prevent default for
   */
  static preventDefault(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Creates a standardized event object from mouse or touch event
   * @param {Event} event - Original event
   * @param {HTMLElement} element - Reference element
   * @returns {Object} Standardized event object
   */
  static createStandardizedEvent(event, element) {
    const coords = this.getNormalizedEventCoords(event, element);
    return {
      originalEvent: event,
      x: coords.x,
      y: coords.y,
      shiftKey: event.shiftKey || false,
      altKey: event.altKey || false,
      ctrlKey: event.ctrlKey || false,
      metaKey: event.metaKey || false
    };
  }
}

export default EventHandlers;