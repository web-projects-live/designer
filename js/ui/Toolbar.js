/**
 * Toolbar Class
 * Manages the toolbar UI component for tool selection
 */
class Toolbar {
  /**
   * Create a new Toolbar instance
   * @param {HTMLElement} element - The toolbar DOM element
   * @param {Object} options - Toolbar options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.activeToolButton = null;
    this.tools = [
      { id: 'text', name: 'Text', icon: 'text' },
      { id: 'rect', name: 'Rectangle', icon: 'rectangle' },
      { id: 'circle', name: 'Circle', icon: 'circle' },
      { id: 'triangle', name: 'Triangle', icon: 'triangle' }
    ];
    
    // Initialize toolbar
    this.init();
  }

  /**
   * Initialize the toolbar
   */
  init() {
    // Clear existing content
    this.element.innerHTML = '';
    
    // Create tool buttons section
    const toolsSection = document.createElement('div');
    toolsSection.className = 'toolbar-section';
    
    // Add tool buttons
    this.tools.forEach(tool => {
      const button = this.createToolButton(tool);
      toolsSection.appendChild(button);
    });
    
    // Create actions section
    const actionsSection = document.createElement('div');
    actionsSection.className = 'toolbar-section';
    
    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-btn';
    deleteButton.className = 'toolbar-button danger';
    deleteButton.title = 'Delete selected element';
    deleteButton.innerHTML = this.createIconHTML('delete');
    deleteButton.addEventListener('click', () => this.handleDeleteClick());
    actionsSection.appendChild(deleteButton);
    
    // Add clear button
    const clearButton = document.createElement('button');
    clearButton.id = 'clear-btn';
    clearButton.className = 'toolbar-button danger';
    clearButton.title = 'Clear canvas';
    clearButton.innerHTML = this.createIconHTML('clear');
    clearButton.addEventListener('click', () => this.handleClearClick());
    actionsSection.appendChild(clearButton);
    
    // Add export button
    const exportButton = document.createElement('button');
    exportButton.id = 'export-btn';
    exportButton.className = 'toolbar-button';
    exportButton.title = 'Export as PNG';
    exportButton.innerHTML = this.createIconHTML('export');
    exportButton.addEventListener('click', () => this.handleExportClick());
    actionsSection.appendChild(exportButton);
    
    // Add sections to toolbar
    this.element.appendChild(toolsSection);
    this.element.appendChild(actionsSection);
    
    // Set default active tool
    this.setActiveTool('text');
  }

  /**
   * Create a tool button element
   * @param {Object} tool - Tool configuration
   * @returns {HTMLElement} Button element
   */
  createToolButton(tool) {
    const button = document.createElement('button');
    button.id = `${tool.id}-tool-btn`;
    button.className = 'toolbar-button';
    button.title = tool.name;
    button.dataset.tool = tool.id;
    button.innerHTML = this.createIconHTML(tool.icon);
    
    // Add click event listener
    button.addEventListener('click', () => this.handleToolClick(button, tool.id));
    
    return button;
  }

  /**
   * Create HTML for an icon
   * @param {string} iconName - Icon name
   * @returns {string} Icon HTML
   */
  createIconHTML(iconName) {
    // Use SVG icons
    return `<img src="assets/icons/${iconName}.svg" alt="${iconName}" width="24" height="24">`;
  }

  /**
   * Handle tool button click
   * @param {HTMLElement} button - Clicked button
   * @param {string} toolId - Tool ID
   */
  handleToolClick(button, toolId) {
    this.setActiveTool(toolId);
    
    // Trigger custom event
    this.element.dispatchEvent(new CustomEvent('tool:selected', {
      detail: { toolId }
    }));
  }

  /**
   * Set the active tool
   * @param {string} toolId - Tool ID
   */
  setActiveTool(toolId) {
    // Remove active class from current active button
    if (this.activeToolButton) {
      this.activeToolButton.classList.remove('active');
    }
    
    // Find and set new active button
    const button = document.getElementById(`${toolId}-tool-btn`);
    if (button) {
      button.classList.add('active');
      this.activeToolButton = button;
    }
  }

  /**
   * Handle delete button click
   */
  handleDeleteClick() {
    // Trigger custom event
    this.element.dispatchEvent(new CustomEvent('action:delete'));
  }

  /**
   * Handle clear button click
   */
  handleClearClick() {
    if (confirm('Are you sure you want to clear the canvas?')) {
      // Trigger custom event
      this.element.dispatchEvent(new CustomEvent('action:clear'));
    }
  }

  /**
   * Handle export button click
   */
  handleExportClick() {
    // Trigger custom event
    this.element.dispatchEvent(new CustomEvent('action:export'));
  }

  /**
   * Get the currently selected tool
   * @returns {string} Tool ID
   */
  getActiveTool() {
    return this.activeToolButton ? this.activeToolButton.dataset.tool : null;
  }
}

export default Toolbar;