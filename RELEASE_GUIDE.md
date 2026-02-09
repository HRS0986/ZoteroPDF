# ZoteroPDF Release Guide

This guide will walk you through releasing your ZoteroPDF plugin to GitHub and making it available for Zotero users.

## Prerequisites

Before releasing, ensure you have:

1. ✅ A GitHub repository: `https://github.com/HRS0986/ZoteroPDF`
2. ✅ Git installed and configured
3. ✅ All changes committed to your repository
4. ✅ GitHub Personal Access Token (for automated releases)

## Release Process

### Option 1: Automated Release (Recommended)

The template includes an automated release workflow using GitHub Actions.

#### Step 1: Commit and Push Your Changes

```powershell
# Check current status
git status

# Add all changes
git add .

# Commit with a meaningful message
git commit -m "feat: initial release of ZoteroPDF plugin"

# Push to GitHub
git push origin main
```

#### Step 2: Run the Release Command

```powershell
# This will:
# 1. Prompt you for the new version number
# 2. Update package.json with the new version
# 3. Create a git tag
# 4. Push the tag to GitHub
# 5. Trigger GitHub Actions to build and release

npm run release
```

When prompted:

- For your first release, select version `1.0.0` (already set)
- For subsequent releases, choose appropriate version bump (patch/minor/major)

#### Step 3: GitHub Actions Will Automatically:

1. Build the plugin (`.xpi` file)
2. Create a GitHub Release with the `.xpi` file
3. Generate `update.json` for auto-updates
4. Publish everything to the Releases page

### Option 2: Manual Release

If you prefer manual control or GitHub Actions isn't set up:

#### Step 1: Build the Plugin

```powershell
# Build production version
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

The `.xpi` file will be in `.scaffold/build/`

#### Step 2: Create a Git Tag

```powershell
# Commit all changes first
git add .
git commit -m "Release v1.0.0"

# Create and push tag
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

#### Step 3: Create GitHub Release

1. Go to `https://github.com/HRS0986/ZoteroPDF/releases`
2. Click "Create a new release"
3. Choose tag: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description: Add release notes (see template below)
6. Upload the `.xpi` file from `.scaffold/build/`
7. Click "Publish release"

### Release Notes Template

```markdown
## 🎉 Initial Release - ZoteroPDF v1.0.0

A simple and efficient Zotero plugin for exporting PDF files from your library.

### ✨ Features

- **Export Selected PDFs**: Right-click on any item(s) with PDF attachments and export them
- **Export Collection PDFs**: Right-click on a collection to export all PDF files
- **Smart Detection**: Automatically detects PDF attachments from regular items
- **Progress Tracking**: Visual progress indicator during export operations
- **Batch Export**: Export multiple PDFs at once

### 📦 Installation

1. Download the `zoteropdf-1.0.0.xpi` file below
2. In Zotero, go to `Tools` → `Add-ons`
3. Click the gear icon and select `Install Add-on From File...`
4. Select the downloaded `.xpi` file
5. Restart Zotero

### 🔧 Requirements

- Zotero 7 or later

### 📝 Usage

**Export Selected Items:**

1. Select one or more items in your Zotero library
2. Right-click and select `ZoteroPDF: Export Selected As PDF`
3. Choose a destination folder

**Export Collection:**

1. Right-click on any collection
2. Select `ZoteroPDF: Export Collection As PDF`
3. Choose a destination folder

### 🐛 Known Issues

None at this time.

### 🙏 Acknowledgments

Built with the [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template).
```

## Setting Up GitHub Actions (For Automated Releases)

### Step 1: Check GitHub Actions Configuration

The template should already have `.github/workflows/release.yml`. Verify it exists:

```powershell
ls .github/workflows/
```

### Step 2: Set Up GitHub Token (if needed)

GitHub Actions should work automatically with the default `GITHUB_TOKEN`. No additional setup needed.

### Step 3: Enable GitHub Actions

1. Go to `https://github.com/HRS0986/ZoteroPDF/settings/actions`
2. Ensure "Allow all actions and reusable workflows" is selected
3. Save if you made changes

## After Release

### 1. Verify the Release

1. Check `https://github.com/HRS0986/ZoteroPDF/releases`
2. Verify the `.xpi` file is attached
3. Download and test the `.xpi` file in Zotero

### 2. Update Documentation

If needed, update your README with:

- Installation instructions pointing to the latest release
- Any new features or changes
- Updated screenshots or demos

### 3. Share Your Plugin

Consider sharing on:

- [Zotero Forums](https://forums.zotero.org/)
- [Zotero Plugins Directory](https://www.zotero.org/support/plugins)
- Social media or your blog

## Subsequent Releases

For future updates:

1. Make your changes
2. Commit them
3. Run `npm run release`
4. Choose version bump:
   - **Patch** (1.0.0 → 1.0.1): Bug fixes
   - **Minor** (1.0.0 → 1.1.0): New features, backward compatible
   - **Major** (1.0.0 → 2.0.0): Breaking changes

## Troubleshooting

### Build Fails

```powershell
# Clean and rebuild
Remove-Item -Recurse -Force .scaffold -ErrorAction SilentlyContinue
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

### GitHub Actions Not Running

1. Check `.github/workflows/release.yml` exists
2. Verify GitHub Actions is enabled in repository settings
3. Check the Actions tab for error messages

### Users Can't Auto-Update

Ensure:

1. `update.json` is in the `release` release (created automatically)
2. Users installed from your GitHub releases (not sideloaded)

## Version Numbering Guide

Follow [Semantic Versioning](https://semver.org/):

- **1.0.0**: Initial release
- **1.0.1**: Bug fix (patch)
- **1.1.0**: New feature (minor)
- **2.0.0**: Breaking change (major)

## Support

If you encounter issues:

1. Check the [Zotero Plugin Template docs](https://github.com/windingwind/zotero-plugin-template)
2. Review [zotero-plugin-scaffold docs](https://github.com/northword/zotero-plugin-scaffold)
3. Ask in [Zotero Forums](https://forums.zotero.org/)
