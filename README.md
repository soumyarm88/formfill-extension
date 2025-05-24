# FormFill Extension 🚀

A Chrome browser extension to quickly fill text boxes in forms with prepared values.

![Extension Preview](https://img.shields.io/badge/Chrome-Extension-brightgreen)
![Version](https://img.shields.io/badge/version-1.0-blue)


## ✨ Features

- **💾 Preset Management** - Save frequently used text values with custom names
- **📁 File Import/Export** - Bulk import presets from JSON, CSV, or TXT files
- **⚡ Quick Fill** - One-click filling of any text input field
- **🎪 Visual Feedback** - Field highlighting and success notifications

## 🚀 Installation

### From Source (Recommended for development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/soumyarm88/formfill-extension.git
   cd formfill-extension
   ```

2. **Load the extension in Chrome**
    - Open Chrome and navigate to `chrome://extensions/`
    - Enable "Developer mode" (toggle in top right corner)
    - Click "Load unpacked" and select the extension folder
    - The FormFill Extension icon should appear in your toolbar

## 📖 How to Use

### Creating Presets
1. Click the FormFill Extension icon in your Chrome toolbar
2. Enter a **Preset Name** (e.g., "Email", "Full Name", "Address")
3. Enter the corresponding **Value** you want to fill
4. Click **"Save Preset"**

### Filling Forms
1. Navigate to any webpage with text input fields
2. Click on the text field you want to fill
3. Open the FormFill Extension popup
4. Click on a saved preset to use it, or

### Managing Presets
- **Use a preset**: Click on any saved preset in the list
- **Delete a preset**: Click the × button next to the preset name
- **Edit a preset**: Click the preset, modify the value, and save again. A new preset will be created if the preset name is modified.

## 📁 File Import/Export

### Supported File Formats

#### JSON Format
```json
{
  "Full Name": "John Doe",
  "Email": "john.doe@example.com",
  "Phone": "(555) 123-4567",
  "Address": "123 Main Street, Anytown, ST 12345"
}
```

#### CSV Format
```csv
Full Name,John Doe
Email,john.doe@example.com
Phone,(555) 123-4567
Address,"123 Main Street, Anytown, ST 12345"
```

#### TXT Format
```txt
# Form Auto-Filler Presets
Full Name: John Doe
Email: john.doe@example.com
Phone: (555) 123-4567
Address: 123 Main Street, Anytown, ST 12345

# You can also use equals sign
Alt Email=john.alternative@gmail.com
```

### Import Process
1. Click **"Choose File"** in the extension popup
2. Select your preset file (.json, .csv, or .txt)
3. Click **"Import"** to load the presets
4. New presets will be merged with existing ones

### Export Process
1. Click **"Export"** to download all current presets
2. File will be saved as `form-presets-YYYY-MM-DD.json`
