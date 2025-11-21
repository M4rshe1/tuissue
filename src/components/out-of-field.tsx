"use client";

import type { BaseFieldConfig } from "./form-dialog";

export interface OutOfFieldConfig extends BaseFieldConfig {
  type: "outOf";
  defaultValue?: number;
  label: string;
  count?: number;
  mode?: "allLeft" | "single";
}

export interface OutOfMultiFieldConfig extends BaseFieldConfig {
  type: "outOfMulti";
  defaultValue?: number[];
  label: string;
  count?: number;
}

type OutOfFieldProps = {
  field: OutOfFieldConfig | OutOfMultiFieldConfig;
  value: number | number[];
  onChange: (value: number | number[]) => void;
};

export function OutOfField({ field, value, onChange }: OutOfFieldProps) {
  const count = field.count || 10;
  const isMulti = field.type === "outOfMulti";
  const singleVisualMode =
    field.type === "outOf" ? field.mode || "allLeft" : "single";

  const handleSquareClick = (squareNumber: number) => {
    if (isMulti) {
      const currentValue = Array.isArray(value) ? value : [];
      const index = currentValue.indexOf(squareNumber);
      if (index > -1) {
        const newValue = currentValue.filter((v) => v !== squareNumber);
        onChange(newValue);
      } else {
        const newValue = [...currentValue, squareNumber].sort((a, b) => a - b);
        onChange(newValue);
      }
    } else {
      onChange(squareNumber);
    }
  };

  const isSquareSelected = (squareNumber: number): boolean => {
    if (isMulti) {
      const currentValue = Array.isArray(value) ? value : [];
      return currentValue.includes(squareNumber);
    } else {
      const currentValue = typeof value === "number" ? value : 0;
      if (singleVisualMode === "allLeft") {
        return squareNumber <= currentValue;
      } else {
        return squareNumber === currentValue;
      }
    }
  };

  return (
    <div className="flex flex-nowrap gap-2">
      {Array.from({ length: count }, (_, i) => i + 1).map((squareNumber) => {
        const isSelected = isSquareSelected(squareNumber);
        return (
          <button
            key={squareNumber}
            type="button"
            onClick={() => handleSquareClick(squareNumber)}
            className={`flex h-10 flex-1 items-center justify-center rounded-md border-2 transition-colors ${
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary/50"
            } `}
          >
            {squareNumber}
          </button>
        );
      })}
    </div>
  );
}
