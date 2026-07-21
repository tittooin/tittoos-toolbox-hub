import { ContentItem } from "../types";

export class CMSEngineService {
  static async fetchItems(contentType: string): Promise<ContentItem[]> {
    return [];
  }

  static async fetchItemById(id: string): Promise<ContentItem | null> {
    return null;
  }

  static async saveItem(item: ContentItem): Promise<boolean> {
    return true;
  }

  static async deleteItem(id: string): Promise<boolean> {
    return true;
  }
}
