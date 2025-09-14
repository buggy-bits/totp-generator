const ENTRIES_KEY = 'totp_entries';

export interface StoredEntry {
  id: string;
  issuer: string;
  createdAt: number;
}

export const localStorage = {
  // Get all stored entry IDs
  getEntries(): StoredEntry[] {
    try {
      const stored = window.localStorage.getItem(ENTRIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Add new entry ID
  addEntry(entry: StoredEntry): void {
    try {
      const entries = this.getEntries();
      const updated = [...entries.filter(e => e.id !== entry.id), entry];
      window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save entry to localStorage:', error);
    }
  },

  // Remove entry ID
  removeEntry(id: string): void {
    try {
      const entries = this.getEntries();
      const updated = entries.filter(entry => entry.id !== id);
      window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove entry from localStorage:', error);
    }
  },

  // Update entry issuer
  updateEntry(id: string, issuer: string): void {
    try {
      const entries = this.getEntries();
      const updated = entries.map(entry => 
        entry.id === id ? { ...entry, issuer } : entry
      );
      window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update entry in localStorage:', error);
    }
  },

  // Clear all entries
  clearEntries(): void {
    try {
      window.localStorage.removeItem(ENTRIES_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
};