/**
 * PropertiesPanel Class
 * Manages the properties panel UI component for editing element properties
 */
class PropertiesPanel {
  /**
   * Create a new PropertiesPanel instance
   * @param {HTMLElement} element - The properties panel DOM element
   * @param {Object} options - Panel options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.currentElement = null;
    
    // Initialize panel
    this.init();
  }

  /**
   * Initialize the properties panel
   */
  init() {
    // Set initial content
    this.showEmptyState();
  }

  /**
   * Show empty state when no element is selected
   */
  showEmptyState() {
    this.element.innerHTML = '<p>No element selected</p>';
  }

  /**
   * Update the panel with element properties
   * @param {BaseElement} element - The selected element
   */
  updatePanel(element) {
    if (!element) {
      this.showEmptyState();
      return;
    }
    
    this.currentElement = element;
    
    // Clear existing content
    this.element.innerHTML = '';
    
    // Create panel header
    const header = document.createElement('h3');
    header.textContent = this.getElementTitle(element);
    this.element.appendChild(header);
    
    // Create properties form
    const form = document.createElement('form');
    form.className = 'properties-form';
    form.addEventListener('submit', (e) => e.preventDefault());
    
    // Add common properties section
    this.addCommonProperties(form, element);
    
    // Add type-specific properties
    if (element.type === 'text') {
      this.addTextProperties(form, element);
    } else if (element.type === 'shape') {
      this.addShapeProperties(form, element);
    }
    
    // Add form to panel
    this.element.appendChild(form);
  }

  /**
   * Get title for element type
   * @param {BaseElement} element - The element
   * @returns {string} Element title
   */
  getElementTitle(element) {
    if (element.type === 'text') {
      return 'Text Properties';
    } else if (element.type === 'shape') {
      return `${this.capitalizeFirst(element.shapeType)} Properties`;
    }
    return 'Element Properties';
  }

  /**
   * Capitalize first letter of a string
   * @param {string} str - Input string
   * @returns {string} Capitalized string
   */
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Add common element properties to form
   * @param {HTMLFormElement} form - The form element
   * @param {BaseElement} element - The element
   */
  addCommonProperties(form, element) {
    const commonGroup = document.createElement('div');
    commonGroup.className = 'property-group';
    
    const commonTitle = document.createElement('div');
    commonTitle.className = 'property-group-title';
    commonTitle.textContent = 'Position & Size';
    commonGroup.appendChild(commonTitle);
    
    // Position fields
    this.addNumberField(commonGroup, 'X Position', 'x', element.x, (value) => {
      element.x = Number(value);
      this.triggerElementUpdate();
    });
    
    this.addNumberField(commonGroup, 'Y Position', 'y', element.y, (value) => {
      element.y = Number(value);
      this.triggerElementUpdate();
    });
    
    // Size fields
    this.addNumberField(commonGroup, 'Width', 'width', element.width, (value) => {
      element.width = Number(value);
      this.triggerElementUpdate();
    });
    
    this.addNumberField(commonGroup, 'Height', 'height', element.height, (value) => {
      element.height = Number(value);
      this.triggerElementUpdate();
    });
    
    form.appendChild(commonGroup);
    
    // Style properties
    const styleGroup = document.createElement('div');
    styleGroup.className = 'property-group';
    
    const styleTitle = document.createElement('div');
    styleTitle.className = 'property-group-title';
    styleTitle.textContent = 'Style';
    styleGroup.appendChild(styleTitle);
    
    // Fill color
    this.addColorField(styleGroup, 'Fill Color', 'fill', element.fill, (value) => {
      element.fill = value;
      this.triggerElementUpdate();
    });
    
    // Stroke color
    this.addColorField(styleGroup, 'Stroke Color', 'stroke', element.stroke, (value) => {
      element.stroke = value;
      this.triggerElementUpdate();
    });
    
    // Stroke width
    this.addNumberField(styleGroup, 'Stroke Width', 'strokeWidth', element.strokeWidth, (value) => {
      element.strokeWidth = Number(value);
      this.triggerElementUpdate();
    }, 0);
    
    form.appendChild(styleGroup);
  }

  /**
   * Add text-specific properties to form
   * @param {HTMLFormElement} form - The form element
   * @param {TextElement} element - The text element
   */
  addTextProperties(form, element) {
    const textGroup = document.createElement('div');
    textGroup.className = 'property-group';
    
    const textTitle = document.createElement('div');
    textTitle.className = 'property-group-title';
    textTitle.textContent = 'Text';
    textGroup.appendChild(textTitle);
    
    // Text content
    this.addTextField(textGroup, 'Text Content', 'text', element.text, (value) => {
      element.text = value;
      this.triggerElementUpdate();
    });
    
    // Font family
    const fontFamilies = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Tahoma', 'Trebuchet MS'];
    this.addDropdownField(textGroup, 'Font Family', 'fontFamily', element.fontFamily, fontFamilies, (value) => {
      element.fontFamily = value;
      this.triggerElementUpdate();
    });
    
    // Font size
    this.addNumberField(textGroup, 'Font Size', 'fontSize', element.fontSize, (value) => {
      element.fontSize = Number(value);
      this.triggerElementUpdate();
    }, 1);
    
    // Font weight
    const fontWeights = ['normal', 'bold', 'lighter', 'bolder'];
    this.addDropdownField(textGroup, 'Font Weight', 'fontWeight', element.fontWeight, fontWeights, (value) => {
      element.fontWeight = value;
      this.triggerElementUpdate();
    });
    
    // Text alignment
    const alignments = ['left', 'center', 'right'];
    this.addDropdownField(textGroup, 'Text Align', 'textAlign', element.textAlign, alignments, (value) => {
      element.textAlign = value;
      this.triggerElementUpdate();
    });
    
    // Line height
    this.addNumberField(textGroup, 'Line Height', 'lineHeight', element.lineHeight, (value) => {
      element.lineHeight = Number(value);
      this.triggerElementUpdate();
    }, 0.1, 0.5, 3, 0.1);
    
    form.appendChild(textGroup);
  }

  /**
   * Add shape-specific properties to form
   * @param {HTMLFormElement} form - The form element
   * @param {ShapeElement} element - The shape element
   */
  addShapeProperties(form, element) {
    const shapeGroup = document.createElement('div');
    shapeGroup.className = 'property-group';
    
    const shapeTitle = document.createElement('div');
    shapeTitle.className = 'property-group-title';
    shapeTitle.textContent = 'Shape';
    shapeGroup.appendChild(shapeTitle);
    
    // Shape type
    const shapeTypes = ['rect', 'roundedRect', 'circle', 'ellipse', 'triangle', 'line', 'arrow'];
    this.addDropdownField(shapeGroup, 'Shape Type', 'shapeType', element.shapeType, shapeTypes, (value) => {
      element.shapeType = value;
      this.triggerElementUpdate();
    });
    
    // Corner radius (for rounded rectangle)
    if (element.shapeType === 'roundedRect') {
      this.addNumberField(shapeGroup, 'Corner Radius', 'cornerRadius', element.cornerRadius, (value) => {
        element.cornerRadius = Number(value);
        this.triggerElementUpdate();
      }, 0);
    }
    
    // Fill enabled
    this.addCheckboxField(shapeGroup, 'Fill Enabled', 'fillEnabled', element.fillEnabled, (value) => {
      element.fillEnabled = value;
      this.triggerElementUpdate();
    });
    
    // Stroke enabled
    this.addCheckboxField(shapeGroup, 'Stroke Enabled', 'strokeEnabled', element.strokeEnabled, (value) => {
      element.strokeEnabled = value;
      this.triggerElementUpdate();
    });
    
    form.appendChild(shapeGroup);
  }

  /**
   * Add a text field to the form
   * @param {HTMLElement} container - Container element
   * @param {string} label - Field label
   * @param {string} name - Field name
   * @param {string} value - Field value
   * @param {Function} onChange - Change handler
   */
  addTextField(container, label, name, value, onChange) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'property-field';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', name);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = name;
    input.name = name;
    input.value = value;
    input.addEventListener('input', (e) => onChange(e.target.value));
    
    fieldContainer.appendChild(labelElement);
    fieldContainer.appendChild(input);
    container.appendChild(fieldContainer);
  }

  /**
   * Add a number field to the form
   * @param {HTMLElement} container - Container element
   * @param {string} label - Field label
   * @param {string} name - Field name
   * @param {number} value - Field value
   * @param {Function} onChange - Change handler
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @param {number} step - Step value
   */
  addNumberField(container, label, name, value, onChange, min = null, max = null, step = null) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'property-field';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', name);
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = name;
    input.name = name;
    input.value = value;
    
    if (min !== null) input.min = min;
    if (max !== null) input.max = max;
    if (step !== null) input.step = step;
    
    input.addEventListener('change', (e) => onChange(e.target.value));
    
    fieldContainer.appendChild(labelElement);
    fieldContainer.appendChild(input);
    container.appendChild(fieldContainer);
  }

  /**
   * Add a dropdown field to the form
   * @param {HTMLElement} container - Container element
   * @param {string} label - Field label
   * @param {string} name - Field name
   * @param {string} value - Field value
   * @param {Array} options - Dropdown options
   * @param {Function} onChange - Change handler
   */
  addDropdownField(container, label, name, value, options, onChange) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'property-field';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', name);
    
    const select = document.createElement('select');
    select.id = name;
    select.name = name;
    
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = this.capitalizeFirst(option);
      if (option === value) {
        optionElement.selected = true;
      }
      select.appendChild(optionElement);
    });
    
    select.addEventListener('change', (e) => onChange(e.target.value));
    
    fieldContainer.appendChild(labelElement);
    fieldContainer.appendChild(select);
    container.appendChild(fieldContainer);
  }

  /**
   * Add a color field to the form
   * @param {HTMLElement} container - Container element
   * @param {string} label - Field label
   * @param {string} name - Field name
   * @param {string} value - Field value
   * @param {Function} onChange - Change handler
   */
  addColorField(container, label, name, value, onChange) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'property-field';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', name);
    
    const colorContainer = document.createElement('div');
    colorContainer.className = 'color-field';
    
    const input = document.createElement('input');
    input.type = 'color';
    input.id = name;
    input.name = name;
    input.value = value === 'transparent' ? '#ffffff' : value;
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = `${name}-text`;
    textInput.value = value;
    
    const transparentCheckbox = document.createElement('input');
    transparentCheckbox.type = 'checkbox';
    transparentCheckbox.id = `${name}-transparent`;
    transparentCheckbox.checked = value === 'transparent';
    
    const transparentLabel = document.createElement('label');
    transparentLabel.textContent = 'Transparent';
    transparentLabel.setAttribute('for', `${name}-transparent`);
    transparentLabel.className = 'checkbox-label';
    
    input.addEventListener('input', (e) => {
      if (!transparentCheckbox.checked) {
        textInput.value = e.target.value;
        onChange(e.target.value);
      }
    });
    
    textInput.addEventListener('input', (e) => {
      if (!transparentCheckbox.checked) {
        // Try to set color input value if valid hex
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          input.value = e.target.value;
        }
        onChange(e.target.value);
      }
    });
    
    transparentCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        textInput.value = 'transparent';
        textInput.disabled = true;
        onChange('transparent');
      } else {
        textInput.value = input.value;
        textInput.disabled = false;
        onChange(input.value);
      }
    });
    
    // Set initial state
    if (value === 'transparent') {
      textInput.disabled = true;
    }
    
    colorContainer.appendChild(input);
    colorContainer.appendChild(textInput);
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-field';
    checkboxContainer.appendChild(transparentCheckbox);
    checkboxContainer.appendChild(transparentLabel);
    
    fieldContainer.appendChild(labelElement);
    fieldContainer.appendChild(colorContainer);
    fieldContainer.appendChild(checkboxContainer);
    container.appendChild(fieldContainer);
  }

  /**
   * Add a checkbox field to the form
   * @param {HTMLElement} container - Container element
   * @param {string} label - Field label
   * @param {string} name - Field name
   * @param {boolean} checked - Whether checkbox is checked
   * @param {Function} onChange - Change handler
   */
  addCheckboxField(container, label, name, checked, onChange) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'checkbox-field property-field';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = name;
    input.name = name;
    input.checked = checked;
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', name);
    
    input.addEventListener('change', (e) => onChange(e.target.checked));
    
    fieldContainer.appendChild(input);
    fieldContainer.appendChild(labelElement);
    container.appendChild(fieldContainer);
  }

  /**
   * Trigger element update event
   */
  triggerElementUpdate() {
    if (this.currentElement) {
      this.element.dispatchEvent(new CustomEvent('element:updated', {
        detail: { element: this.currentElement }
      }));
    }
  }

  /**
   * Clear the panel
   */
  clear() {
    this.currentElement = null;
    this.showEmptyState();
  }
}

export default PropertiesPanel;
