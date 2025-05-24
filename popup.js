document.addEventListener('DOMContentLoaded', function() {
    const presetNameInput = document.getElementById('presetName');
    const presetValueInput = document.getElementById('presetValue');
    const savePresetBtn = document.getElementById('savePreset');
    const presetsList = document.getElementById('presetsList');
    const fileInput = document.getElementById('fileInput');
    const importBtn = document.getElementById('importPresets');
    const exportBtn = document.getElementById('exportPresets');

    // Load and display presets when popup opens
    loadPresets();

    // Save preset
    savePresetBtn.addEventListener('click', function() {
        const name = presetNameInput.value.trim();
        const value = presetValueInput.value.trim();

        if (!name || !value) {
            alert('Please enter both name and value');
            return;
        }

        savePreset(name, value);
        presetNameInput.value = '';
        presetValueInput.value = '';
        loadPresets();
    });

    // Import presets from file
    importBtn.addEventListener('click', function() {
        const file = fileInput.files[0];
        if (!file) {
            showMessage('Please select a file to import', 'error');
            return;
        }

        importFromFile(file);
    });

    // Export presets to file
    exportBtn.addEventListener('click', function() {
        exportPresets();
    });

    function savePreset(name, value) {
        chrome.storage.sync.get(['presets'], function(result) {
            const presets = result.presets || {};
            presets[name] = value;

            chrome.storage.sync.set({presets: presets}, function() {
                console.log('Preset saved');
            });
        });
    }

    function importFromFile(file) {
        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop().toLowerCase();

        reader.onload = function(e) {
            try {
                let presets = {};
                const content = e.target.result;

                if (fileExtension === 'json') {
                    presets = parseJSONPresets(content);
                } else if (fileExtension === 'csv') {
                    presets = parseCSVPresets(content);
                } else if (fileExtension === 'txt') {
                    presets = parseTXTPresets(content);
                } else {
                    throw new Error('Unsupported file format');
                }

                if (Object.keys(presets).length === 0) {
                    throw new Error('No valid presets found in file');
                }

                // Merge with existing presets
                chrome.storage.sync.get(['presets'], function(result) {
                    const existingPresets = result.presets || {};
                    const mergedPresets = {...existingPresets, ...presets};

                    chrome.storage.sync.set({presets: mergedPresets}, function() {
                        const count = Object.keys(presets).length;
                        showMessage(`Successfully imported ${count} presets`, 'success');
                        loadPresets();
                        fileInput.value = ''; // Clear file input
                    });
                });

            } catch (error) {
                showMessage(`Import failed: ${error.message}`, 'error');
            }
        };

        reader.readAsText(file);
    }

    function parseJSONPresets(content) {
        const data = JSON.parse(content);

        // Handle different JSON formats
        if (Array.isArray(data)) {
            // Array format: [{"name": "Email", "value": "test@example.com"}, ...]
            const presets = {};
            data.forEach(item => {
                if (item.name && item.value) {
                    presets[item.name] = item.value;
                }
            });
            return presets;
        } else if (typeof data === 'object') {
            // Object format: {"Email": "test@example.com", "Name": "John Doe", ...}
            return data;
        } else {
            throw new Error('Invalid JSON format');
        }
    }

    function parseCSVPresets(content) {
        const presets = {};
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Split by comma, handling quoted values
            const match = line.match(/^"?([^"]*)"?\s*,\s*"?([^"]*)"?$/);
            if (match) {
                const name = match[1].trim();
                const value = match[2].trim();
                if (name && value) {
                    presets[name] = value;
                }
            }
        }

        return presets;
    }

    function parseTXTPresets(content) {
        const presets = {};
        const lines = content.split('\n');

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue; // Skip empty lines and comments

            // Support formats: "name=value" or "name: value"
            const colonMatch = line.match(/^([^:]+):\s*(.+)$/);
            const equalsMatch = line.match(/^([^=]+)=(.+)$/);

            if (colonMatch) {
                const name = colonMatch[1].trim();
                const value = colonMatch[2].trim();
                if (name && value) {
                    presets[name] = value;
                }
            } else if (equalsMatch) {
                const name = equalsMatch[1].trim();
                const value = equalsMatch[2].trim();
                if (name && value) {
                    presets[name] = value;
                }
            }
        }

        return presets;
    }

    function exportPresets() {
        chrome.storage.sync.get(['presets'], function(result) {
            const presets = result.presets || {};

            if (Object.keys(presets).length === 0) {
                showMessage('No presets to export', 'error');
                return;
            }

            // Create JSON file
            const jsonData = JSON.stringify(presets, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `form-presets-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showMessage('Presets exported successfully', 'success');
        });
    }

    function showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;

        // Insert after file section
        const fileSection = document.querySelector('.file-section');
        fileSection.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    function loadPresets() {
        chrome.storage.sync.get(['presets'], function(result) {
            const presets = result.presets || {};
            displayPresets(presets);
        });
    }

    function displayPresets(presets) {
        const keys = Object.keys(presets);

        if (keys.length === 0) {
            presetsList.innerHTML = '<div class="no-presets">No presets saved yet</div>';
            return;
        }

        presetsList.innerHTML = '';

        keys.forEach(function(name) {
            const presetDiv = document.createElement('div');
            presetDiv.className = 'preset-item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'preset-name';
            nameSpan.textContent = name;

            const valueSpan = document.createElement('span');
            valueSpan.className = 'preset-value';
            valueSpan.textContent = presets[name];
            valueSpan.title = presets[name]; // Show full value on hover

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', function() {
                deletePreset(name);
            });

            // Click preset to use it
            presetDiv.addEventListener('click', function(e) {
                if (e.target === deleteBtn) return;
                presetValueInput.value = presets[name];
                presetNameInput.value = name;
                fillActiveField(presets[name]);
            });

            presetDiv.appendChild(nameSpan);
            presetDiv.appendChild(valueSpan);
            presetDiv.appendChild(deleteBtn);
            presetsList.appendChild(presetDiv);
        });
    }

    function deletePreset(name) {
        chrome.storage.sync.get(['presets'], function(result) {
            const presets = result.presets || {};
            delete presets[name];

            chrome.storage.sync.set({presets: presets}, function() {
                loadPresets();
            });
        });
    }

    function fillActiveField(value) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'fillField',
                value: value
            });
        });
    }
});