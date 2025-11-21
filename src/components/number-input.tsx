"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function NumberInput({
  className,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  defaultValue = 0,
  ...props
}: React.ComponentProps<"input"> & {
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}) {
  const [value, setValue] = useState<number>(defaultValue || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(min, Math.min(max, Number(e.target.value)));
    setValue(newValue);
    onValueChange?.(newValue);
  };

  const handleValueChange = (value: number) => {
    const newValue = Math.max(min, Math.min(max, value));
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={cn("*:not-first:mt-2", className)}>
      <div className="border-input focus-within:border-ring focus-within:ring-ring/50 has-[:invalid]:focus-within:border-destructive has-[:invalid]:focus-within:ring-destructive/20 dark:has-[:invalid]:focus-within:ring-destructive/40 relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px]">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md rounded-r-none border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleValueChange(value - (step as number))}
          disabled={value <= (min as number)}
        >
          <MinusIcon size={16} aria-hidden="true" />
        </Button>
        <Input
          value={value}
          onChange={handleChange}
          {...props}
          type="number"
          className="bg-background text-foreground w-full grow border-0 px-3 py-2 text-center tabular-nums shadow-none [-moz-appearance:textfield] focus:z-10 focus-visible:ring-0 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md rounded-l-none border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleValueChange(value + (step as number))}
          disabled={value >= (max as number)}
        >
          <PlusIcon size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
