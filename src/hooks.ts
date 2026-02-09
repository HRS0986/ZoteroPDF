import { EventHandlerRegistry } from "./modules/eventHandlers";
import { initLocale } from "./utils/locale";
import { createZToolkit } from "./utils/ztoolkit";

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  initLocale();

  await Promise.all(
    Zotero.getMainWindows().map((win) => onMainWindowLoad(win)),
  );

  // Mark initialized as true to confirm plugin loading status
  // outside of the plugin (e.g. scaffold testing process)
  addon.data.initialized = true;
}

async function onMainWindowLoad(win: _ZoteroTypes.MainWindow): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit();

  win.MozXULElement.insertFTLIfNeeded(
    `${addon.data.config.addonRef}-mainWindow.ftl`,
  );

  EventHandlerRegistry.registerRightClickMenuItem();

  EventHandlerRegistry.registerRightClickCollectionMenuItem();
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
  // Remove addon object
  addon.data.alive = false;
  // @ts-expect-error - Plugin instance is not typed
  delete Zotero[addon.data.config.addonInstance];
}

async function onClickCollectionExportPDFs() {
  // Get the selected collection from ZoteroPane
  const ZoteroPane = ztoolkit.getGlobal("ZoteroPane");
  const selectedCollection = ZoteroPane.getSelectedCollection();

  if (!selectedCollection) {
    ztoolkit.log("No collection selected");
    return;
  }

  // Get all items in the collection
  const collectionItems = selectedCollection.getChildItems();

  if (!collectionItems || collectionItems.length === 0) {
    ztoolkit.log("No items in the selected collection");
    return;
  }

  // Get all pdf files from the collection items
  const pdfFiles: Zotero.Item[] = [];

  for (const item of collectionItems) {
    if (
      item.isAttachment() &&
      item.attachmentContentType === "application/pdf"
    ) {
      const filePath = item.getFilePath();
      if (filePath) {
        pdfFiles.push(item);
      }
    } else if (item.isRegularItem()) {
      // If it's a regular item, find all PDF attachments
      const attachments = item.getAttachments();
      for (const attachmentID of attachments) {
        const attachment = Zotero.Items.get(attachmentID);
        if (attachment.attachmentContentType === "application/pdf") {
          const filePath = attachment.getFilePath();
          if (filePath) {
            pdfFiles.push(attachment);
          }
        }
      }
    }
  }

  ztoolkit.log("PDF Files:", pdfFiles);

  if (pdfFiles.length === 0) {
    ztoolkit.log("No PDF files found in the collection");
    return;
  } else {
    // Show progress window
    const progressWindow = new ztoolkit.ProgressWindow(
      addon.data.config.addonName,
      {
        closeOnClick: true,
        closeTime: -1,
      },
    );

    progressWindow.changeHeadline("ZoteroPDF");

    // Open file picker dialog to ask where to save the PDFs
    const savePath = await new ztoolkit.FilePicker(
      "Export PDF Files from Collection",
      "folder",
      [
        ["PDF File (*.pdf)", "*.pdf"],
        ["All Files", "*.*"],
      ],
    ).open();

    ztoolkit.log("Save Path:", savePath);

    if (!savePath) {
      ztoolkit.log("User cancelled file save");
      return;
    }

    progressWindow
      .createLine({
        text: "Exporting PDFs from collection...",
        type: "default",
        progress: 0,
        icon: "loading",
      })
      .show();

    try {
      let i = 1;
      // Copy all pdf files to the selected location
      for (const file of pdfFiles) {
        const filePath = file.getFilePath();
        if (!filePath) {
          ztoolkit.log("PDF file not found");
          continue;
        }
        const finalSavePath = `${savePath}\\${file.attachmentFilename}`;
        await IOUtils.copy(filePath, finalSavePath);
        progressWindow.changeLine({
          text: `Exporting PDF ${i}/${pdfFiles.length}`,
          type: "default",
          progress: (i / pdfFiles.length) * 100,
          icon: "loading",
        });
        i++;
      }

      progressWindow.changeLine({
        text: `${pdfFiles.length} PDF file(s) exported successfully.`,
        type: "success",
        progress: 100,
        icon: "success",
      });
      progressWindow.startCloseTimer(3000);
      ztoolkit.log("PDF files exported successfully to:", savePath);
    } catch (error) {
      progressWindow.changeLine({
        text: `Failed to export PDF files from collection.`,
        type: "error",
        progress: 100,
        icon: "error",
      });
      progressWindow.startCloseTimer(5000);
      ztoolkit.log("Error exporting PDF files:", error);
    }
  }
}

async function onClickExportPDFs() {
  // Get the selected items from ZoteroPane
  const selectedItems = ztoolkit.getGlobal("ZoteroPane").getSelectedItems();

  if (!selectedItems || selectedItems.length === 0) {
    ztoolkit.log("No items selected");
    return;
  }

  // Get all pdf files from the selected items
  const pdfFiles: Zotero.Item[] = [];

  for (const item of selectedItems) {
    if (
      item.isAttachment() &&
      item.attachmentContentType === "application/pdf"
    ) {
      const filePath = item.getFilePath();
      if (filePath) {
        pdfFiles.push(item);
      }
    } else if (item.isRegularItem()) {
      // If it's a regular item, find the first PDF attachment
      const attachments = item.getAttachments();
      for (const attachmentID of attachments) {
        const attachment = Zotero.Items.get(attachmentID);
        if (attachment.attachmentContentType === "application/pdf") {
          pdfFiles.push(attachment);
          break;
        }
      }
    }
  }

  ztoolkit.log("PDF Files:", pdfFiles);

  if (pdfFiles.length === 0) {
    ztoolkit.log("No PDF files found");
    return;
  } else {
    // Show progress window
    const progressWindow = new ztoolkit.ProgressWindow(
      addon.data.config.addonName,
      {
        closeOnClick: true,
        closeTime: -1,
      },
    );

    // Open file picker dialog to ask where to save the PDF
    const savePath = await new ztoolkit.FilePicker(
      "Export PDF Files",
      "folder",
      [
        ["PDF File (*.pdf)", "*.pdf"],
        ["All Files", "*.*"],
      ],
    ).open();

    ztoolkit.log("Save Path:", savePath);

    if (!savePath) {
      ztoolkit.log("User cancelled file save");
      return;
    }

    progressWindow
      .createLine({
        text: "Exporting PDFs...",
        type: "default",
        progress: 0,
        icon: "loading",
      })
      .show();

    try {
      let i = 1;
      // Copy all pdf files to the selected location
      for (const file of pdfFiles) {
        const filePath = file.getFilePath();
        if (!filePath) {
          ztoolkit.log("PDF file not found");
          continue;
        }
        const finalSavePath = `${savePath}\\${file.attachmentFilename}`;
        await IOUtils.copy(filePath, finalSavePath);
        progressWindow.changeLine({
          text: `Exporting PDF ${i}/${pdfFiles.length}`,
          type: "default",
          progress: (i / pdfFiles.length) * 100,
          icon: "loading",
        });
        i++;
      }

      progressWindow.changeLine({
        text: `PDF files exported successfully.`,
        type: "success",
        progress: 100,
        icon: "success",
      });
      progressWindow.startCloseTimer(3000);
      ztoolkit.log("PDF filesexported successfully to:", savePath);
    } catch (error) {
      progressWindow.changeLine({
        text: `Failed to export PDF files.`,
        type: "error",
        progress: 100,
        icon: "error",
      });
      progressWindow.startCloseTimer(5000);
      ztoolkit.log("Error exporting PDF files:", error);
    }
  }
}

// Add your hooks here. For element click, etc.
// Keep in mind hooks only do dispatch. Don't add code that does real jobs in hooks.
// Otherwise the code would be hard to read and maintain.

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onClickExportPDFs,
  onClickCollectionExportPDFs,
};
