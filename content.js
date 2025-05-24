// Track the currently focused/selected input field
let lastFocusedField = null;

// Listen for focus events on input fields
document.addEventListener('focusin', function(e) {
  if (isTextInput(e.target)) {
    lastFocusedField = e.target;
    highlightField(e.target);
  }
});

document.addEventListener('focusout', function(e) {
  if (isTextInput(e.target)) {
    removeHighlight(e.target);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'fillField') {
    fillField(request.value);
    sendResponse({success: true});
  }
});

function isTextInput(element) {
  const tagName = element.tagName.toLowerCase();
  const inputType = element.type ? element.type.toLowerCase() : '';

  // Check if it's a text input, textarea, or contenteditable
  return (
      tagName === 'textarea' ||
      tagName === 'input' && (
          inputType === 'text' ||
          inputType === 'email' ||
          inputType === 'search' ||
          inputType === 'url' ||
          inputType === 'tel' ||
          inputType === 'password' ||
          inputType === '' // default input type is text
      ) ||
      element.contentEditable === 'true'
  );
}

function fillField(value) {
  let targetField = lastFocusedField;

  // If no field was focused, try to find the currently active element
  if (!targetField || !document.contains(targetField)) {
    targetField = document.activeElement;
    if (!isTextInput(targetField)) {
      // Try to find any visible text input on the page
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="search"], input[type="url"], input[type="tel"], input:not([type]), textarea, [contenteditable="true"]');
      for (let input of inputs) {
        if (isVisible(input)) {
          targetField = input;
          break;
        }
      }
    }
  }

  if (!targetField || !isTextInput(targetField)) {
    showNotification('No text field selected. Please click on a text input first.');
    return;
  }

  // Fill the field
  if (targetField.contentEditable === 'true') {
    // For contenteditable elements
    targetField.textContent = value;
    targetField.innerHTML = value;
  } else {
    // For regular input fields and textareas
    targetField.value = value;
  }

  // Trigger input events to notify any JavaScript listeners
  triggerInputEvents(targetField);

  // Highlight the filled field briefly
  flashField(targetField);

  showNotification('Field filled successfully!');
}

function triggerInputEvents(element) {
  // Create and dispatch input events
  const inputEvent = new Event('input', { bubbles: true });
  const changeEvent = new Event('change', { bubbles: true });

  element.dispatchEvent(inputEvent);
  element.dispatchEvent(changeEvent);

  // Also trigger keyup for compatibility with some forms
  const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
  element.dispatchEvent(keyupEvent);
}

function isVisible(element) {
  return element.offsetWidth > 0 &&
      element.offsetHeight > 0 &&
      window.getComputedStyle(element).visibility !== 'hidden' &&
      window.getComputedStyle(element).display !== 'none';
}

function highlightField(element) {
  element.style.outline = '2px solid #2196F3';
  element.style.outlineOffset = '1px';
}

function removeHighlight(element) {
  element.style.outline = '';
  element.style.outlineOffset = '';
}

function flashField(element) {
  const originalBg = element.style.backgroundColor;
  element.style.backgroundColor = '#4CAF50';
  element.style.transition = 'background-color 0.3s';

  setTimeout(() => {
    element.style.backgroundColor = originalBg;
    setTimeout(() => {
      element.style.transition = '';
    }, 300);
  }, 300);
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transition: opacity 0.3s;
  `;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}