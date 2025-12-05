"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "../popover";
import { Command, CommandItem, CommandList } from "../command";
import { cn } from "@/lib/utils";
import { OPERATORS as OPERATORS_CONFIG } from "@/lib/operators";
import {
  requiresValueSelection,
  requiresDirectInput,
  getInputComponent,
} from "./field-inputs";
import type {
  ConditionSearchOption,
  ConditionSearchOptionValue,
} from "./types";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectValue: (value: string, valueLabel?: string) => void;
  onSearch: () => void;
  placeholder?: string;
  options: ConditionSearchOption[];
  selectedCategory: string | null;
  selectedOperator: string | null;
  displayValues: ConditionSearchOptionValue[];
  isLoadingValues: boolean;
};

export const SearchInput = ({
  value,
  onChange,
  onSelectCategory,
  onSelectValue,
  onSearch,
  placeholder,
  options,
  selectedCategory,
  selectedOperator,
  displayValues,
  isLoadingValues,
}: SearchInputProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [showDirectInput, setShowDirectInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverContentRef = useRef<HTMLDivElement | null>(null);

  const currentCategory = options.find(
    (opt) => opt.category === selectedCategory,
  );
  const needsDirectInput = currentCategory
    ? requiresDirectInput(currentCategory.type)
    : false;
  const needsValueSelection = currentCategory
    ? requiresValueSelection(currentCategory.type)
    : false;

  const operatorConfig = selectedOperator
    ? OPERATORS_CONFIG[selectedOperator as keyof typeof OPERATORS_CONFIG]
    : null;
  const requiresValue = operatorConfig ? !operatorConfig.selfClearing : false;

  const handleChange = (newValue: string) => {
    onChange(newValue);
    setHighlightedIndex(-1);
    if (newValue.length > 0) {
      if (!selectedCategory) {
        setIsPopoverOpen(true);
        setShowDirectInput(false);
      } else if (selectedOperator && requiresValue) {
        if (needsDirectInput) {
          setShowDirectInput(true);
          setIsPopoverOpen(false);
        } else if (needsValueSelection) {
          setIsPopoverOpen(true);
          setShowDirectInput(false);
        }
      }
    } else if (newValue.length === 0 && !selectedCategory) {
      setIsPopoverOpen(false);
      setShowDirectInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (isPopoverOpen && popoverContentRef.current) {
        e.preventDefault();
        const items = popoverContentRef.current.querySelectorAll(
          '[data-slot="command-item-wrapper"]',
        );
        if (items.length === 0) return;

        let newIndex = highlightedIndex;
        if (e.key === "ArrowDown") {
          newIndex =
            highlightedIndex < items.length - 1 ? highlightedIndex + 1 : 0;
        } else {
          newIndex =
            highlightedIndex > 0 ? highlightedIndex - 1 : items.length - 1;
        }

        setHighlightedIndex(newIndex);
        const item = items[newIndex] as HTMLElement;
        if (item) {
          item.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    } else if (e.key === "Enter") {
      if (showDirectInput && selectedCategory && selectedOperator) {
        // Submit direct input
        e.preventDefault();
        if (value.trim()) {
          onSelectValue(value, value);
          setShowDirectInput(false);
          setHighlightedIndex(-1);
        }
      } else if (isPopoverOpen) {
        if (highlightedIndex >= 0 && popoverContentRef.current) {
          const items = popoverContentRef.current.querySelectorAll(
            '[data-slot="command-item-wrapper"]',
          );
          const item = items[highlightedIndex] as HTMLElement;
          if (item) {
            e.preventDefault();
            item.click();
            setHighlightedIndex(-1);
            return;
          }
        }

        if (!selectedCategory) {
          const filteredOptions = options.filter((option) =>
            value
              ? option.label.toLowerCase().includes(value.toLowerCase())
              : true,
          );
          const matchingCategory =
            filteredOptions[
              highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
                ? highlightedIndex
                : 0
            ];
          if (matchingCategory) {
            e.preventDefault();
            onSelectCategory(matchingCategory.category);
            setHighlightedIndex(-1);
          }
        } else if (selectedOperator && needsValueSelection) {
          const filteredValues = displayValues.filter((v) =>
            value ? v.label.toLowerCase().includes(value.toLowerCase()) : true,
          );
          const matchingValue =
            filteredValues[
              highlightedIndex >= 0 && highlightedIndex < filteredValues.length
                ? highlightedIndex
                : 0
            ];
          if (matchingValue) {
            e.preventDefault();
            onSelectValue(matchingValue.value, matchingValue.label);
            setHighlightedIndex(-1);
          }
        }
      } else {
        onSearch();
      }
    } else if (e.key === "Escape") {
      if (isPopoverOpen || showDirectInput) {
        setIsPopoverOpen(false);
        setShowDirectInput(false);
        setHighlightedIndex(-1);
      }
    } else {
      setHighlightedIndex(-1);
    }
  };

  const handleFocus = () => {
    if (value.length > 0 && !selectedCategory) {
      setIsPopoverOpen(true);
    } else if (selectedCategory && selectedOperator && requiresValue) {
      if (needsDirectInput) {
        setShowDirectInput(true);
      } else if (needsValueSelection) {
        setIsPopoverOpen(true);
      }
    }
  };

  return (
    <div className="relative min-w-[200px] flex-1">
      <input
        ref={inputRef}
        type="text"
        placeholder={
          showDirectInput
            ? `Enter ${currentCategory?.type.toLowerCase()} value...`
            : placeholder
        }
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className="text-foreground w-full min-w-0 text-sm outline-none focus:ring-0 focus:ring-offset-0"
      />
      {/* {showDirectInput && (
        <div className="text-muted-foreground absolute top-0 right-0 text-xs">
          Press Enter to apply
        </div>
      )} */}
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => {
          setIsPopoverOpen(open);
          if (!open) {
            setHighlightedIndex(-1);
          }
        }}
        modal={false}
      >
        <PopoverAnchor asChild>
          <div className="pointer-events-none absolute inset-0" />
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-[300px] p-0"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          onInteractOutside={(e) => {
            if (
              e.target === inputRef.current ||
              inputRef.current?.contains(e.target as Node)
            ) {
              e.preventDefault();
            }
          }}
          boxProps={{
            style: {
              background: "bg-popover",
              content: "p-0",
            },
          }}
        >
          <div ref={popoverContentRef}>
            <Command shouldFilter={false} className="space-y-2">
              {!selectedCategory ? (
                <CommandList className="py-2">
                  {options
                    .filter((option) =>
                      value
                        ? option.label
                            .toLowerCase()
                            .includes(value.toLowerCase())
                        : true,
                    )
                    .map((option, index) => (
                      <CommandItem
                        key={option.category}
                        onSelect={() => {
                          onSelectCategory(option.category);
                          setHighlightedIndex(-1);
                        }}
                        className={cn(
                          highlightedIndex === index &&
                            "bg-accent text-accent-foreground",
                        )}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                </CommandList>
              ) : selectedOperator && needsValueSelection ? (
                <CommandList className="py-2">
                  {isLoadingValues ? (
                    <div className="text-muted-foreground flex items-center justify-center py-6 text-sm">
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <>
                      {displayValues
                        .filter((valueOption) =>
                          value
                            ? valueOption.label
                                .toLowerCase()
                                .includes(value.toLowerCase())
                            : true,
                        )
                        .map((valueOption, index) => (
                          <CommandItem
                            key={valueOption.value}
                            onSelect={() => {
                              onSelectValue(
                                valueOption.value,
                                valueOption.label,
                              );
                              setHighlightedIndex(-1);
                            }}
                            className={cn(
                              highlightedIndex === index &&
                                "bg-accent text-accent-foreground",
                            )}
                          >
                            {valueOption.icon}
                            {valueOption.label}
                          </CommandItem>
                        ))}
                    </>
                  )}
                </CommandList>
              ) : null}
            </Command>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
