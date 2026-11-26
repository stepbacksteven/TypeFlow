import { openDB } from "idb";

export type Draft = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

const database = openDB("accessdraft-local", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("drafts")) {
      const store = db.createObjectStore("drafts", { keyPath: "id" });
      store.createIndex("updatedAt", "updatedAt");
    }
  }
});

export async function getDrafts(): Promise<Draft[]> {
  const db = await database;
  return (await db.getAll("drafts")).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveDraft(draft: Draft): Promise<void> {
  const db = await database;
  await db.put("drafts", draft);
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await database;
  await db.delete("drafts", id);
}
