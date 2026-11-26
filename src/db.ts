import { openDB } from "idb";
export type Preferences = {
  wpm:number; mode:"character"|"word"; variable:boolean; punctuation:boolean;
  wordPause:number; sentencePause:number; paragraphPause:number; dark:boolean;
  fontSize:number; dyslexia:boolean; highContrast:boolean; largeButtons:boolean;
  clutterFree:boolean; speechRate:number;
};
if (typeof indexedDB !== "undefined") { indexedDB.deleteDatabase("accessdraft-local"); }
const dbPromise = openDB("accessdraft-settings", 1, {
  upgrade(db) { if (!db.objectStoreNames.contains("preferences")) db.createObjectStore("preferences"); }
});
export async function loadSettings():Promise<Preferences|null> { const db=await dbPromise; return (await db.get("preferences","user")) ?? null; }
export async function saveSettings(value:Preferences):Promise<void> { const db=await dbPromise; await db.put("preferences",value,"user"); }
