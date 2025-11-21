"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { FormDialog, type FormDialogConfig } from "@/components/form-dialog";

export type FormDialogResult<T = Record<string, any>> =
  | { success: true; data: T }
  | { success: false; data: null };

type FormDialogContextType = {
  openDialog: (config: FormDialogConfig) => Promise<FormDialogResult>;
};

const FormDialogContext = createContext<FormDialogContextType | null>(null);

export function FormDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<FormDialogConfig | null>(null);
  const [resolver, setResolver] = useState<{
    resolve: (value: FormDialogResult) => void;
  } | null>(null);

  const openDialog = useCallback(
    (dialogConfig: FormDialogConfig): Promise<FormDialogResult> => {
      setConfig(dialogConfig);
      setIsOpen(true);

      return new Promise((resolve) => {
        setResolver({ resolve });
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    (values: Record<string, any>) => {
      resolver?.resolve({ success: true, data: values });
      setIsOpen(false);
      setResolver(null);
    },
    [resolver],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        resolver?.resolve({ success: false, data: null });
        setResolver(null);
      }
      setIsOpen(open);
    },
    [resolver],
  );

  return (
    <FormDialogContext.Provider value={{ openDialog }}>
      {children}
      <FormDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        config={config}
        onSubmit={handleSubmit}
      />
    </FormDialogContext.Provider>
  );
}

export function useFormDialog() {
  const context = useContext(FormDialogContext);
  if (!context) {
    throw new Error("useFormDialog must be used within FormDialogProvider");
  }
  return context;
}
