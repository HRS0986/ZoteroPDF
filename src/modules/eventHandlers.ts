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
        const selectedItems = ztoolkit
          .getGlobal("ZoteroPane")
          .getSelectedItems();

        if (!selectedItems || selectedItems.length === 0) return false;

        for (const item of selectedItems) {
          if (
            item.isAttachment() &&
            item.attachmentContentType === "application/pdf"
          ) {
            return true;
          }
          if (item.isRegularItem()) {
            const attachments = item.getAttachments();
            for (const attachmentID of attachments) {
              const attachment = Zotero.Items.get(attachmentID);
              if (attachment.attachmentContentType === "application/pdf") return true;
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
        const ZoteroPane = ztoolkit.getGlobal("ZoteroPane");
        const selectedCollection = ZoteroPane.getSelectedCollection();

        if (!selectedCollection) return false;
        const collectionItems = selectedCollection.getChildItems();
        if (!collectionItems || collectionItems.length === 0) return false;

        for (const item of collectionItems) {
          if (
            item.isAttachment() &&
            item.attachmentContentType === "application/pdf"
          ) {
            return true;
          }
          if (item.isRegularItem()) {
            const attachments = item.getAttachments();
            for (const attachmentID of attachments) {
              const attachment = Zotero.Items.get(attachmentID);
              if (attachment.attachmentContentType === "application/pdf") return true;
            }
          }
        }
        return false;
      },
    });
  }
}
