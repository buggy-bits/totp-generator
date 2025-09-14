import { useState, useEffect } from 'react';
import { localStorage as storage, StoredEntry } from '../utils/localStorage';

export function useLocalStorage() {
  const [entries, setEntries] = useState<StoredEntry[]>([]);

  useEffect(() => {
    setEntries(storage.getEntries());
  }, []);

  const addEntry = (entry: StoredEntry) => {
    storage.addEntry(entry);
    setEntries(storage.getEntries());
  };

  const removeEntry = (id: string) => {
    storage.removeEntry(id);
    setEntries(storage.getEntries());
  };

  const updateEntry = (id: string, issuer: string) => {
    storage.updateEntry(id, issuer);
    setEntries(storage.getEntries());
  };

  const clearEntries = () => {
    storage.clearEntries();
    setEntries([]);
  };

  return {
    entries,
    addEntry,
    removeEntry,
    updateEntry,
    clearEntries,
  };
}