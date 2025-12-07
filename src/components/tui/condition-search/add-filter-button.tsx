"use client";

import { useState, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "../command";
import { getOperatorsForType } from "./utils";
import { OPERATORS as OPERATORS_CONFIG } from "@/lib/operators";
import {
  requiresValueSelection,
  requiresDirectInput,
  getInputComponent,
  supportsMultipleSelection,
} from "./field-inputs";
import { cn } from "@/lib/utils";
import type {
  ConditionSearchOption,
  ConditionSearchOptionValue,
} from "./types";

type AddFilterButtonProps = {
  options: ConditionSearchOption[];
  onSelectCategory: (category: string) => void;
  onSelectOperator: (operator: string) => void;
  onSelectValue: (value: string, valueLabel?: string) => void;
  onFetchValues?: (
    category: string,
    searchQuery: string,
  ) => Promise<ConditionSearchOptionValue[]>;
  asyncValues: ConditionSearchOptionValue[];
  isLoadingValues: boolean;
  valueSearchQuery: string;
  onValueSearchQueryChange: (query: string) => void;
};

export const AddFilterButton = ({
  options,
  onSelectCategory,
  onSelectOperator,
  onSelectValue,
  asyncValues,
  isLoadingValues,
  valueSearchQuery,
  onValueSearchQueryChange,
}: AddFilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [directInputValue, setDirectInputValue] = useState("");
  const [selectedMultiValues, setSelectedMultiValues] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentCategory = options.find(
    (opt) => opt.category === selectedCategory,
  );

  const availableOperators = currentCategory
    ? getOperatorsForType(currentCategory.type)
    : [];

  const needsDirectInput = currentCategory
    ? requiresDirectInput(currentCategory.type)
    : false;
  const needsValueSelection = currentCategory
    ? requiresValueSelection(currentCategory.type)
    : false;
  const isMultiSelect = currentCategory
    ? supportsMultipleSelection(currentCategory.type)
    : false;

  const operatorConfig = selectedOperator
    ? OPERATORS_CONFIG[selectedOperator as keyof typeof OPERATORS_CONFIG]
    : null;
  const requiresValue = operatorConfig ? !operatorConfig.selfClearing : true;

  const handleOpen = () => {
    setIsOpen(true);
    setSelectedCategory(null);
    setSelectedOperator(null);
    setDirectInputValue("");
    setSelectedMultiValues([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    setSelectedOperator(null);
    setDirectInputValue("");
    setSelectedMultiValues([]);
    onValueSearchQueryChange("");
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setDirectInputValue("");
    setSelectedMultiValues([]);
    onSelectCategory(category);
  };

  const handleSelectOperator = (operator: string) => {
    setSelectedOperator(operator);
    setDirectInputValue("");
    setSelectedMultiValues([]);
    onSelectOperator(operator);
  };

  const handleSelectValue = (value: string, valueLabel?: string) => {
    onSelectValue(value, valueLabel);
    handleClose();
  };

  const handleDirectInputSubmit = () => {
    if (directInputValue.trim()) {
      onSelectValue(directInputValue, directInputValue);
      handleClose();
    }
  };

  const handleMultiSelectToggle = (value: string) => {
    const newSelectedValues = selectedMultiValues.includes(value)
      ? selectedMultiValues.filter((v) => v !== value)
      : [...selectedMultiValues, value];
    setSelectedMultiValues(newSelectedValues);
  };

  const handleMultiSelectApply = () => {
    if (selectedMultiValues.length > 0) {
      const displayValues = getDisplayValues();
      const labels = selectedMultiValues
        .map((val) => displayValues.find((v) => v.value === val)?.label)
        .filter(Boolean) as string[];

      const combinedValue = selectedMultiValues.join(",");
      const combinedLabel = labels.join(", ");

      onSelectValue(combinedValue, combinedLabel);
      handleClose();
    }
  };

  const getDisplayValues = () => {
    if (!currentCategory) return [];
    if (currentCategory.useAsyncValues) {
      return asyncValues;
    }
    return currentCategory.values || [];
  };

  const showValueStep =
    selectedOperator &&
    requiresValue &&
    (needsValueSelection || needsDirectInput);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleOpen}
          className="border-border hover:bg-accent flex size-6 items-center justify-center rounded-sm border transition-colors"
          aria-label="Add filter"
        >
          <Plus className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[300px] p-0"
        boxProps={{
          style: {
            background: "bg-popover",
            content: "p-0",
          },
          text: {
            topLeft: !selectedCategory
              ? "Category"
              : !selectedOperator
                ? "Operator"
                : needsDirectInput
                  ? "Enter Value"
                  : "Value",
          },
        }}
      >
        <Command className="space-y-2">
          {!selectedCategory ? (
            <>
              <CommandInput
                placeholder="Search categories..."
                box={{
                  style: {
                    background: "bg-transparent",
                  },
                }}
                defaultValue={valueSearchQuery}
                onChange={(e) => onValueSearchQueryChange(e.target.value)}
              />
              <CommandList>
                {options.map((option) => (
                  <CommandItem
                    key={option.category}
                    onSelect={() => handleSelectCategory(option.category)}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </>
          ) : !selectedOperator ? (
            <>
              <CommandInput
                placeholder="Search operators..."
                defaultValue={valueSearchQuery}
                onChange={(e) => onValueSearchQueryChange(e.target.value)}
              />
              <CommandList>
                <CommandEmpty>No operator found.</CommandEmpty>
                {availableOperators.map((operator) => (
                  <CommandItem
                    key={operator.value}
                    onSelect={() => handleSelectOperator(operator.value)}
                  >
                    {operator.label}
                  </CommandItem>
                ))}
              </CommandList>
            </>
          ) : showValueStep ? (
            needsDirectInput ? (
              <div className="space-y-2 p-3">
                {(() => {
                  const InputComponent = currentCategory
                    ? getInputComponent(currentCategory.type)
                    : null;
                  if (!InputComponent) {
                    return (
                      <input
                        ref={inputRef}
                        type="text"
                        value={directInputValue}
                        onChange={(e) => setDirectInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleDirectInputSubmit();
                          }
                        }}
                        placeholder="Enter value..."
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        autoFocus
                      />
                    );
                  }
                  return (
                    <InputComponent
                      ref={inputRef}
                      value={directInputValue}
                      onChange={setDirectInputValue}
                      onSubmit={handleDirectInputSubmit}
                      placeholder="Enter value..."
                      autoFocus
                      type={currentCategory?.type}
                      min={currentCategory?.min}
                      max={currentCategory?.max}
                      step={currentCategory?.step}
                    />
                  );
                })()}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="hover:bg-accent rounded-md px-3 py-1 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectInputSubmit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <>
                <CommandInput
                  placeholder="Search values..."
                  value={valueSearchQuery}
                  onChange={(e) => onValueSearchQueryChange(e.target.value)}
                />
                <CommandList>
                  {isLoadingValues ? (
                    <div className="text-muted-foreground flex items-center justify-center py-6 text-sm">
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>No value found.</CommandEmpty>
                      {isMultiSelect ? (
                        <>
                          {getDisplayValues().map((valueOption) => {
                            const isSelected = selectedMultiValues.includes(
                              valueOption.value,
                            );
                            return (
                              <CommandItem
                                key={valueOption.value}
                                onSelect={() =>
                                  handleMultiSelectToggle(valueOption.value)
                                }
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "flex size-4 items-center justify-center rounded border",
                                      isSelected
                                        ? "border-primary bg-primary"
                                        : "border-muted",
                                    )}
                                  >
                                    {isSelected && (
                                      <svg
                                        className="text-primary-foreground size-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  {valueOption.icon}
                                  {valueOption.label}
                                </div>
                              </CommandItem>
                            );
                          })}
                          {selectedMultiValues.length > 0 && (
                            <div className="border-t p-2">
                              <button
                                type="button"
                                onClick={handleMultiSelectApply}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-3 py-1.5 text-sm"
                              >
                                Apply ({selectedMultiValues.length} selected)
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        getDisplayValues().map((valueOption) => (
                          <CommandItem
                            key={valueOption.value}
                            onSelect={() =>
                              handleSelectValue(
                                valueOption.value,
                                valueOption.label,
                              )
                            }
                          >
                            {valueOption.icon}
                            {valueOption.label}
                          </CommandItem>
                        ))
                      )}
                    </>
                  )}
                </CommandList>
              </>
            )
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
