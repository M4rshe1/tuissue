"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/ui/date-picker";

type BaseInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
};

export const TextFieldInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ value, onChange, onSubmit, placeholder, className, autoFocus }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        className={cn("text-sm", className)}
        autoFocus={autoFocus}
      />
    );
  },
);
TextFieldInput.displayName = "TextFieldInput";

// Number input for NUMBER type
export const NumberFieldInput = forwardRef<
  HTMLInputElement,
  BaseInputProps & { min?: number; max?: number; step?: number }
>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder,
      className,
      autoFocus,
      min,
      max,
      step,
    },
    ref,
  ) => {
    return (
      <Input
        ref={ref}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        className={cn("text-sm", className)}
        autoFocus={autoFocus}
        min={min}
        max={max}
        step={step}
      />
    );
  },
);
NumberFieldInput.displayName = "NumberFieldInput";

// Date input for DATE, DATE_TIME, and TIME types
export const DateFieldInput = forwardRef<
  HTMLDivElement,
  Omit<BaseInputProps, "onChange"> & {
    onChange: (value: string) => void;
    type?: "DATE" | "DATE_TIME" | "TIME";
  }
>(({ value, onChange, onSubmit, className, type = "DATE" }, ref) => {
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      if (type === "DATE") {
        onChange(date.toISOString().split("T")[0] || "");
      } else if (type === "DATE_TIME") {
        onChange(date.toISOString());
      } else if (type === "TIME") {
        onChange(date.toTimeString().split(" ")[0] || "");
      }
      if (onSubmit) {
        onSubmit();
      }
    }
  };

  const dateValue = value ? new Date(value) : undefined;

  return (
    <div ref={ref} className={cn("flex items-center", className)}>
      <DatePicker defaultValue={dateValue} onSelect={handleDateChange} />
    </div>
  );
});
DateFieldInput.displayName = "DateFieldInput";

// Boolean input for BOOLEAN type
export const BooleanFieldInput = ({
  value,
  onChange,
  onSubmit,
  className,
}: BaseInputProps) => {
  const boolValue = value === "true" || value === "1";

  const handleChange = (checked: boolean) => {
    onChange(checked ? "true" : "false");
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Checkbox checked={boolValue} onCheckedChange={handleChange} />
      <label className="text-sm">{boolValue ? "True" : "False"}</label>
    </div>
  );
};

// Link input for LINK type
export const LinkFieldInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ value, onChange, onSubmit, placeholder, className, autoFocus }, ref) => {
    return (
      <Input
        ref={ref}
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder || "https://example.com"}
        className={cn("text-sm", className)}
        autoFocus={autoFocus}
      />
    );
  },
);
LinkFieldInput.displayName = "LinkFieldInput";

// Helper to determine if a field type requires value selection from a list
export const requiresValueSelection = (fieldType: string): boolean => {
  return [
    "SELECT",
    "MULTI_SELECT",
    "USER",
    "USER_LIST",
    "STATE",
    "FILE",
  ].includes(fieldType);
};

// Helper to determine if a field type supports multiple selections
export const supportsMultipleSelection = (fieldType: string): boolean => {
  return ["MULTI_SELECT", "USER_LIST"].includes(fieldType);
};

// Helper to determine if a field type requires direct input
export const requiresDirectInput = (fieldType: string): boolean => {
  return [
    "TEXT",
    "TEXT_AREA",
    "NUMBER",
    "DATE",
    "DATE_TIME",
    "TIME",
    "BOOLEAN",
    "LINK",
  ].includes(fieldType);
};

// Helper to get the appropriate input component for a field type
export const getInputComponent = (
  fieldType: string,
): React.ComponentType<any> | null => {
  switch (fieldType) {
    case "TEXT":
    case "TEXT_AREA":
      return TextFieldInput;
    case "NUMBER":
      return NumberFieldInput;
    case "DATE":
    case "DATE_TIME":
    case "TIME":
      return DateFieldInput;
    case "BOOLEAN":
      return BooleanFieldInput;
    case "LINK":
      return LinkFieldInput;
    default:
      return null;
  }
};
