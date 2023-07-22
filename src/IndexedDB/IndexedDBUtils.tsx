interface Note {
  id: number;
  text: string;
}
export const initializeIndexedDB = () => {
  const request = window.indexedDB.open("myNotesDB", 1);

  request.onerror = (event: any) => {
    console.error("Ошибка при открытии базы данных:", event.target.error);
  };

  request.onupgradeneeded = (event: any) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("notes")) {
      db.createObjectStore("notes", { keyPath: "id" });
      console.log("createdStore");
    }
  };
};
export const getNotesFromIndexedDB = (): Promise<Note[]> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("myNotesDB", 1);

    request.onerror = (event: any) => {
      console.error("Ошибка при открытии базы данных:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction("notes", "readonly");
      const objectStore = transaction.objectStore("notes");
      const getNotesRequest = objectStore.getAll();

      getNotesRequest.onsuccess = () => {
        resolve(getNotesRequest.result);
      };

      getNotesRequest.onerror = (event: any) => {
        console.error(
          "Ошибка при чтении заметок из IndexedDB:",
          event.target.error
        );
        reject(event.target.error);
      };
    };
  });
};

export const saveNotesToIndexedDB = (notes: Note[]): void => {
  const request = window.indexedDB.open("myNotesDB", 1);
  request.onsuccess = (event: any) => {
    const db = event.target.result;
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");

    notes.forEach((note) => {
      const addRequest = objectStore.add(note);
      addRequest.onsuccess = (e: any) => {
        console.log("Note added successfully!", e.target.result);
      };
      addRequest.onerror = (e: any) => {
        console.error("Error adding note:", e.target.error);
      };
    });
  };
};
