"use client";

import { useState } from "react";
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

  const currentCategory = options.find(
    (opt) => opt.category === selectedCategory,
  );

  const availableOperators = currentCategory
    ? getOperatorsForType(currentCategory.type)
    : [];

  const handleOpen = () => {
    setIsOpen(true);
    setSelectedCategory(null);
    setSelectedOperator(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    setSelectedOperator(null);
    onValueSearchQueryChange("");
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const handleSelectOperator = (operator: string) => {
    setSelectedOperator(operator);
    onSelectOperator(operator);
  };

  const handleSelectValue = (value: string, valueLabel?: string) => {
    onSelectValue(value, valueLabel);
    handleClose();
  };

  const getDisplayValues = () => {
    if (!currentCategory) return [];
    if (currentCategory.useAsyncValues) {
      return asyncValues;
    }
    return currentCategory.values;
  };

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
            topLeft: selectedCategory
              ? "Category"
              : selectedOperator
                ? "Operator"
                : "Value",
          },
        }}
      >
        <Command className="space-y-2">
          {!selectedCategory ? (
            <>
              <CommandInput placeholder="Search categories..." />
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
              <CommandInput placeholder="Search operators..." />
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
                    {getDisplayValues().map((valueOption) => (
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
                    ))}
                  </>
                )}
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
