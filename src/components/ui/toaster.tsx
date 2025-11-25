"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      variant={toast.variant}
      title={toast.title}
      description={toast.description}
      button={{
        label: toast.button.label,
        onClick: () => toast.button.onClick(),
      }}
    />
  ));
}

function Toast(props: ToastProps) {
  const { title, description, button, id, variant } = props;

  return (
    <div
      className={cn(
        "flex w-full items-center p-4 shadow-lg ring-1 md:max-w-[364px]",
        {
          "bg-green-50 text-green-600": variant === "success",
          "bg-red-50 text-red-600": variant === "error",
          "bg-yellow-50 text-yellow-600": variant === "warning",
          "bg-blue-50 text-blue-600": variant === "info",
        },
      )}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
        <button
          className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </button>
      </div>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  variant: "success" | "error" | "warning" | "info";
  button: {
    label: string;
    onClick: () => void;
  };
}
