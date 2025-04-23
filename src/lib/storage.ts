
import { TimeEntry, User } from "@/types";

const USER_KEY = 'ojt-user';
const ENTRIES_KEY = 'ojt-time-entries';

// User functions
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Time entries functions
export const saveTimeEntries = (entries: TimeEntry[]): void => {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
};

export const getTimeEntries = (): TimeEntry[] => {
  const entries = localStorage.getItem(ENTRIES_KEY);
  return entries ? JSON.parse(entries) : [];
};

export const addTimeEntry = (entry: TimeEntry): void => {
  const entries = getTimeEntries();
  entries.push(entry);
  saveTimeEntries(entries);
};

export const updateTimeEntry = (entry: TimeEntry): void => {
  const entries = getTimeEntries();
  const index = entries.findIndex(e => e.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    saveTimeEntries(entries);
  }
};

export const deleteTimeEntry = (id: string): void => {
  const entries = getTimeEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  saveTimeEntries(filteredEntries);
};
