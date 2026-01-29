# Troubleshooting Zotero Plugin Development Connection Issues

## Problem
`npm start` fails with error: `ECONNREFUSED 127.0.0.1:<port>`

## Root Cause
The development server cannot connect to Zotero's debug bridge/HTTP server.

## Solutions (Try in order)

### 1. Ensure No Zotero Instances Are Running
```powershell
# Check for running Zotero processes
Get-Process | Where-Object {$_.ProcessName -like "*zotero*"}

# Kill all Zotero processes if any are found
Get-Process | Where-Object {$_.ProcessName -like "*zotero*"} | Stop-Process -Force
```

### 2. Verify Environment Configuration
Check that your `.env` file has correct paths:
- `ZOTERO_PLUGIN_ZOTERO_BIN_PATH` - Path to zotero.exe
- `ZOTERO_PLUGIN_PROFILE_PATH` - Path to development profile
- `ZOTERO_PLUGIN_DATA_DIR` - Path to Zotero data directory

### 3. Check Windows Firewall
The connection might be blocked by Windows Firewall:

1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Ensure both Node.js and Zotero have permissions for Private and Public networks

### 4. Disable Antivirus Temporarily
Some antivirus software blocks local connections. Try temporarily disabling it.

### 5. Check for Port Conflicts
Another application might be using the port:

```powershell
# Check what's using common Zotero ports
netstat -ano | findstr "23119"
netstat -ano | findstr "61964"
```

### 6. Try Running Zotero Manually First
Sometimes starting Zotero manually before running `npm start` helps:

1. Close all Zotero instances
2. Start Zotero manually using your development profile:
   ```powershell
   & "C:\Program Files\Zotero\zotero.exe" -p hn7so8bk.dev
   ```
3. In Zotero, go to Edit → Settings → Advanced → Config Editor
4. Search for and verify these settings:
   - `extensions.zotero.httpServer.enabled` = `true`
   - `extensions.zotero.httpServer.port` = `23119` (or note the port)
5. Restart Zotero
6. Then run `npm start` in a new terminal

### 7. Enable Verbose Logging
Uncomment the logLevel in `zotero-plugin.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  logLevel: "trace",  // Uncomment this line
});
```

This will show more detailed logs about what's happening.

### 8. Check Node.js Version
Ensure you're using a compatible Node.js version:

```powershell
node --version
```

Should be LTS version (18.x or 20.x recommended).

### 9. Clean Build and Reinstall
```powershell
# Clean everything
Remove-Item -Recurse -Force .scaffold, node_modules -ErrorAction SilentlyContinue

# Reinstall dependencies
npm install

# Try starting again
npm start
```

### 10. Check Zotero Beta Version
Ensure you're using Zotero 7 beta (required for modern plugin development):
- Download from: https://www.zotero.org/support/beta_builds

## Still Not Working?

If none of the above works, please:
1. Enable trace logging (step 7)
2. Run `npm start` and capture the full output
3. Check Zotero's debug output (Help → Debug Output Logging → View Output)
4. Report the issue with both logs
