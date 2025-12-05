"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

export type Shortcut = {
  id: string;
  label: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  letters: string[];
  escKey?: boolean;
  action: (event: KeyboardEvent | "trigger") => void;
};

type ShortcutsContextType = {
  shortcuts: Shortcut[];
  addShortcut: (shortcut: Shortcut) => void;
  addShortcuts: (shortcuts: Shortcut[]) => void;
  removeShortcut: (id: string) => void;
  removeShortcuts: (ids: string[]) => void;
  clearShortcuts: () => void;
  triggerShortcut: (id: string) => void;
};

const ShortcutsContext = createContext<ShortcutsContextType | null>(null);

export type ShortcutsProviderProps = {
  children: ReactNode;
  defaultShortcuts?: Shortcut[];
};

export function ShortcutsProvider({
  children,
  defaultShortcuts = [],
}: ShortcutsProviderProps) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(defaultShortcuts);
  const shortcutsRef = useRef<Shortcut[]>(shortcuts);

  // Keep ref in sync with state
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const addShortcut = useCallback((shortcut: Shortcut) => {
    setShortcuts((current) => {
      const exists = current.some((s) => s.id === shortcut.id);
      if (exists) {
        return current.map((s) => (s.id === shortcut.id ? shortcut : s));
      }
      return [...current, shortcut];
    });
  }, []);

  const addShortcuts = useCallback((newShortcuts: Shortcut[]) => {
    setShortcuts((current) => {
      const updated = [...current];
      for (const shortcut of newShortcuts) {
        const existingIndex = updated.findIndex((s) => s.id === shortcut.id);
        if (existingIndex !== -1) {
          updated[existingIndex] = shortcut;
        } else {
          updated.push(shortcut);
        }
      }
      return updated;
    });
  }, []);

  const removeShortcut = useCallback((id: string) => {
    setShortcuts((current) => current.filter((s) => s.id !== id));
  }, []);

  const removeShortcuts = useCallback((ids: string[]) => {
    setShortcuts((current) => current.filter((s) => !ids.includes(s.id)));
  }, []);

  const clearShortcuts = useCallback(() => {
    setShortcuts(defaultShortcuts);
  }, [defaultShortcuts]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (isInputFocused) return;

      const currentShortcuts = shortcutsRef.current;
      for (const shortcut of currentShortcuts) {
        if (shortcut.escKey && event.key !== "Escape") continue;
        if (shortcut.ctrlKey && !event.ctrlKey) continue;
        if (shortcut.shiftKey && !event.shiftKey) continue;
        if (shortcut.altKey && !event.altKey) continue;
        if (shortcut.metaKey && !event.metaKey) continue;
        if (!shortcut.ctrlKey && event.ctrlKey) continue;
        if (!shortcut.shiftKey && event.shiftKey) continue;
        if (!shortcut.altKey && event.altKey) continue;
        if (!shortcut.metaKey && event.metaKey) continue;
        const lettersMatch = shortcut.letters.every(
          (letter) => event.key.toLowerCase() === letter.toLowerCase(),
        );
        if (!lettersMatch) continue;
        event.preventDefault();
        shortcut.action(event);
        break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const triggerShortcut = useCallback(
    (id: string) => {
      const shortcut = shortcuts.find((s) => s.id === id);
      if (shortcut) {
        shortcut.action("trigger");
      }
    },
    [shortcuts],
  );

  return (
    <ShortcutsContext.Provider
      value={{
        shortcuts,
        addShortcut,
        addShortcuts,
        removeShortcut,
        removeShortcuts,
        clearShortcuts,
        triggerShortcut,
      }}
    >
      {children}
    </ShortcutsContext.Provider>
  );
}

export function useShortcuts() {
  const context = useContext(ShortcutsContext);
  if (!context) {
    throw new Error("useShortcuts must be used within ShortcutsProvider");
  }
  return context;
}
