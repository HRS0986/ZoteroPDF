import { getString } from "../utils/locale";

export class EventHandlerRegistry {
  static registerRightClickMenuItem() {
    const menuIcon = `chrome://${addon.data.config.addonRef}/content/icons/favicon@0.5x.png`;
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-itemmenu-zoteropdf-export",
      label: getString("menuitem-label"),
      commandListener: (_) => addon.hooks.onClickExportPDFs(),
      icon: menuIcon,
      getVisibility: () => {
        // Get selected items
        const selectedItems = ztoolkit
          .getGlobal("ZoteroPane")
          .getSelectedItems();

        if (!selectedItems || selectedItems.length === 0) {
          return false;
        }

        // Check if any selected item has a PDF attachment
        for (const item of selectedItems) {
          // If the item itself is a PDF attachment
          if (
            item.isAttachment() &&
            item.attachmentContentType === "application/pdf"
          ) {
            return true;
          }
          // If it's a regular item, check for PDF attachments
          if (item.isRegularItem()) {
            const attachments = item.getAttachments();
            for (const attachmentID of attachments) {
              const attachment = Zotero.Items.get(attachmentID);
              if (attachment.attachmentContentType === "application/pdf") {
                return true;
              }
            }
          }
        }

        return false;
      },
    });
  }

  static registerRightClickCollectionMenuItem() {
    const menuIcon = `chrome://${addon.data.config.addonRef}/content/icons/favicon@0.5x.png`;
    ztoolkit.Menu.register("collection", {
      tag: "menuitem",
      id: "zotero-collectionmenu-zoteropdf-export",
      label: getString("menuitem-label-collection"),
      commandListener: (_) => addon.hooks.onClickCollectionExportPDFs(),
      icon: menuIcon,
      getVisibility: () => {
        // Get the selected collection
        const ZoteroPane = ztoolkit.getGlobal("ZoteroPane");
        const selectedCollection = ZoteroPane.getSelectedCollection();

        if (!selectedCollection) {
          return false;
        }

        // Get all items in the collection
        const collectionItems = selectedCollection.getChildItems();

        if (!collectionItems || collectionItems.length === 0) {
          return false;
        }

        // Check if any item in the collection has a PDF attachment
        for (const item of collectionItems) {
          // If the item itself is a PDF attachment
          if (
            item.isAttachment() &&
            item.attachmentContentType === "application/pdf"
          ) {
            return true;
          }
          // If it's a regular item, check for PDF attachments
          if (item.isRegularItem()) {
            const attachments = item.getAttachments();
            for (const attachmentID of attachments) {
              const attachment = Zotero.Items.get(attachmentID);
              if (attachment.attachmentContentType === "application/pdf") {
                return true;
              }
            }
          }
        }

        return false;
      },
    });
  }
}
