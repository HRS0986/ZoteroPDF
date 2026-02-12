<p align="center">
  <img src="assets/banner.png" alt="ZoteroPDF Banner" width="100%">
</p>

# ZoteroPDF

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

A simple and efficient Zotero plugin for exporting PDF files from your library.

## Features

- **Export Selected PDFs**: Right-click on any item(s) with PDF attachments and export them to a folder of your choice
- **Export Collection PDFs**: Right-click on a collection to export all PDF files from that collection
- **Smart Detection**: Automatically detects PDF attachments from regular items
- **Progress Tracking**: Visual progress indicator during export operations
- **Batch Export**: Export multiple PDFs at once

## Installation

1. Download the latest `.xpi` file from the [Releases](https://github.com/HRS0986/ZoteroPDF/releases) page
2. In Zotero, go to `Tools` → `Plugins`
3. Click the gear icon and select `Install Plugin From File...`
4. Select the downloaded `.xpi` file
5. Restart Zotero

## Usage

### Export Selected Items

1. Select one or more items in your Zotero library
2. Right-click and select `ZoteroPDF: Export Selected As PDF`
3. Choose a destination folder
4. The PDFs will be exported with their original filenames

### Export Collection

1. Right-click on any collection in your library
2. Select `ZoteroPDF: Export Collection As PDF`
3. Choose a destination folder
4. All PDFs from the collection will be exported

## Development

### Requirements

- [Zotero 7 Beta](https://www.zotero.org/support/beta_builds)
- [Node.js LTS](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/HRS0986/ZoteroPDF.git
   cd ZoteroPDF
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment:

   ```bash
   cp .env.example .env
   # Edit .env with your Zotero installation path
   ```

4. Start development server:
   ```bash
   npm start
   ```

### Build

Build the plugin for production:

```bash
npm run build
```

The built `.xpi` file will be in the `.scaffold/build/` directory.

### Release

```bash
npm run release
```

This will prompt for a version number, build the plugin, and create a GitHub release.

## License

This project is licensed under the AGPL-3.0-or-later License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with the [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template) by windingwind.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/HRS0986/ZoteroPDF/issues) on GitHub.
