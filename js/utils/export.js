/**
 * Export Utility
 * Provides functionality to export canvas content as PNG images
 */

class ExportUtils {
  /**
   * Export canvas content as PNG image
   * @param {Canvas} canvas - The Canvas instance
   * @param {Object} options - Export options
   * @returns {string} Data URL of the exported image
   */
  static exportAsPNG(canvas, options = {}) {
    const defaultOptions = {
      fileName: 'design.png',
      preserveSelection: false,
      backgroundColor: canvas.backgroundColor,
      quality: 1.0,
      showNotification: true
    };
    
    const exportOptions = { ...defaultOptions, ...options };
    
    // Store current selection state
    const selectedElement = canvas.getSelectedElement();
    let wasSelected = false;
    
    // Temporarily hide selection if needed
    if (selectedElement && !exportOptions.preserveSelection) {
      wasSelected = selectedElement.isSelected();
      selectedElement.setSelected(false);
      canvas.render();
    }
    
    // Get canvas data URL
    const dataURL = canvas.canvas.toDataURL('image/png', exportOptions.quality);
    
    // Restore selection if needed
    if (selectedElement && wasSelected && !exportOptions.preserveSelection) {
      selectedElement.setSelected(true);
      canvas.render();
    }
    
    return dataURL;
  }
  
  /**
   * Trigger download of canvas as PNG
   * @param {Canvas} canvas - The Canvas instance
   * @param {Object} options - Export options
   */
  static downloadAsPNG(canvas, options = {}) {
    const dataURL = this.exportAsPNG(canvas, options);
    
    // Create download link
    const link = document.createElement('a');
    link.download = options.fileName || 'design.png';
    link.href = dataURL;
    link.style.display = 'none';
    
    // Add to DOM, trigger click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show notification if enabled
    if (options.showNotification) {
      this.showExportNotification();
    }
    
    return dataURL;
  }
  
  /**
   * Show a notification that the export was successful
   * @param {string} message - Notification message
   */
  static showExportNotification(message = 'Design exported successfully!') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'export-notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  /**
   * Create a preview of the export
   * @param {Canvas} canvas - The Canvas instance
   * @param {Object} options - Preview options
   * @returns {HTMLElement} Preview element
   */
  static createExportPreview(canvas, options = {}) {
    const dataURL = this.exportAsPNG(canvas, { 
      ...options, 
      showNotification: false 
    });
    
    // Create preview container
    const container = document.createElement('div');
    container.className = 'export-preview-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0,0,0,0.7)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000';
    
    // Create preview image
    const preview = document.createElement('div');
    preview.className = 'export-preview';
    preview.style.backgroundColor = 'white';
    preview.style.padding = '20px';
    preview.style.borderRadius = '4px';
    preview.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    preview.style.maxWidth = '80%';
    preview.style.maxHeight = '80%';
    preview.style.overflow = 'auto';
    preview.style.position = 'relative';
    
    // Add image to preview
    const img = document.createElement('img');
    img.src = dataURL;
    img.style.maxWidth = '100%';
    img.style.display = 'block';
    
    // Add download button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.style.marginTop = '15px';
    downloadBtn.style.padding = '8px 16px';
    downloadBtn.style.backgroundColor = '#2196F3';
    downloadBtn.style.color = 'white';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '4px';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.onclick = () => {
      this.downloadAsPNG(canvas, options);
    };
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
      document.body.removeChild(container);
    };
    
    // Assemble preview
    preview.appendChild(closeBtn);
    preview.appendChild(img);
    preview.appendChild(downloadBtn);
    container.appendChild(preview);
    
    // Add click handler to close on background click
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        document.body.removeChild(container);
      }
    });
    
    return container;
  }
  
  /**
   * Show export dialog with options
   * @param {Canvas} canvas - The Canvas instance
   */
  static showExportDialog(canvas) {
    // Create dialog container
    const container = document.createElement('div');
    container.className = 'export-dialog-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0,0,0,0.7)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'export-dialog';
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '4px';
    dialog.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    dialog.style.width = '400px';
    dialog.style.maxWidth = '90%';
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = 'Export Design';
    title.style.marginTop = '0';
    
    // Add file name input
    const fileNameLabel = document.createElement('label');
    fileNameLabel.textContent = 'File name:';
    fileNameLabel.style.display = 'block';
    fileNameLabel.style.marginTop = '15px';
    
    const fileNameInput = document.createElement('input');
    fileNameInput.type = 'text';
    fileNameInput.value = 'design.png';
    fileNameInput.style.width = '100%';
    fileNameInput.style.padding = '8px';
    fileNameInput.style.boxSizing = 'border-box';
    fileNameInput.style.marginTop = '5px';
    
    // Add quality option
    const qualityLabel = document.createElement('label');
    qualityLabel.textContent = 'Quality:';
    qualityLabel.style.display = 'block';
    qualityLabel.style.marginTop = '15px';
    
    const qualityInput = document.createElement('input');
    qualityInput.type = 'range';
    qualityInput.min = '0.1';
    qualityInput.max = '1.0';
    qualityInput.step = '0.1';
    qualityInput.value = '1.0';
    qualityInput.style.width = '100%';
    qualityInput.style.marginTop = '5px';
    
    // Add buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.marginTop = '20px';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.padding = '8px 16px';
    cancelBtn.style.backgroundColor = '#f5f5f5';
    cancelBtn.style.border = '1px solid #ddd';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.onclick = () => {
      document.body.removeChild(container);
    };
    
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export';
    exportBtn.style.padding = '8px 16px';
    exportBtn.style.backgroundColor = '#2196F3';
    exportBtn.style.color = 'white';
    exportBtn.style.border = 'none';
    exportBtn.style.borderRadius = '4px';
    exportBtn.style.cursor = 'pointer';
    exportBtn.onclick = () => {
      const options = {
        fileName: fileNameInput.value,
        quality: parseFloat(qualityInput.value)
      };
      this.downloadAsPNG(canvas, options);
      document.body.removeChild(container);
    };
    
    // Add preview button
    const previewBtn = document.createElement('button');
    previewBtn.textContent = 'Preview';
    previewBtn.style.padding = '8px 16px';
    previewBtn.style.backgroundColor = '#4CAF50';
    previewBtn.style.color = 'white';
    previewBtn.style.border = 'none';
    previewBtn.style.borderRadius = '4px';
    previewBtn.style.cursor = 'pointer';
    previewBtn.onclick = () => {
      const options = {
        fileName: fileNameInput.value,
        quality: parseFloat(qualityInput.value),
        showNotification: false
      };
      document.body.appendChild(this.createExportPreview(canvas, options));
    };
    
    // Assemble dialog
    dialog.appendChild(title);
    dialog.appendChild(fileNameLabel);
    dialog.appendChild(fileNameInput);
    dialog.appendChild(qualityLabel);
    dialog.appendChild(qualityInput);
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(previewBtn);
    buttonContainer.appendChild(exportBtn);
    dialog.appendChild(buttonContainer);
    container.appendChild(dialog);
    
    // Add click handler to close on background click
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        document.body.removeChild(container);
      }
    });
    
    return container;
  }
}

export default ExportUtils;
