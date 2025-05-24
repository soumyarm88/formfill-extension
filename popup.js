document.addEventListener('DOMContentLoaded', function() {
    const presetNameInput = document.getElementById('presetName');
    const presetValueInput = document.getElementById('presetValue');
    const savePresetBtn = document.getElementById('savePreset');
    const fillSelectedBtn = document.getElementById('fillSelected');
    const presetsList = document.getElementById('presetsList');

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

    // Fill selected field with current preset value
    fillSelectedBtn.addEventListener('click', function() {
        const value = presetValueInput.value.trim();
        if (!value) {
            alert('Please enter a value to fill');
            return;
        }

        fillActiveField(value);
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