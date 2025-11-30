"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import { Command, CommandInput, CommandItem, CommandList } from "../command";
import { OPERATORS as OPERATORS_CONFIG } from "@/lib/operators";
import { cn } from "@/lib/utils";
import { getOperatorsForType } from "./utils";
import type {
  StructuredQuery,
  ConditionSearchOption,
  ConditionSearchOptionValue,
} from "./types";

type FilterTagProps = {
  query: StructuredQuery;
  index: number;
  categoryLabel: string;
  operatorLabel: string;
  valueLabel: string;
  options: ConditionSearchOption[];
  onRemove: (index: number) => void;
  onEditOperator: (operator: string) => void;
  onEditValue: (value: string, valueLabel?: string) => void;
  onFetchValues?: (
    category: string,
    searchQuery: string,
  ) => Promise<ConditionSearchOptionValue[]>;
};

export const FilterTag = ({
  query,
  index,
  categoryLabel,
  operatorLabel,
  valueLabel,
  options,
  onRemove,
  onEditOperator,
  onEditValue,
  onFetchValues,
}: FilterTagProps) => {
  const [editingType, setEditingType] = useState<"operator" | "value" | null>(
    null,
  );
  const [editSearchQuery, setEditSearchQuery] = useState("");
  const [editAsyncValues, setEditAsyncValues] = useState<
    ConditionSearchOptionValue[]
  >([]);
  const [isLoadingEditValues, setIsLoadingEditValues] = useState(false);

  const operatorConfig =
    OPERATORS_CONFIG[query.operator as keyof typeof OPERATORS_CONFIG];
  const isSelfClearing = operatorConfig?.selfClearing ?? false;

  const handleEditOperator = () => {
    setEditingType("operator");
    setEditSearchQuery("");
  };

  const handleEditValue = () => {
    setEditingType("value");
    setEditSearchQuery("");
    const categoryOption = options.find(
      (opt) => opt.category === query.category,
    );
    if (categoryOption?.useAsyncValues && onFetchValues) {
      setIsLoadingEditValues(true);
      onFetchValues(query.category, "")
        .then((values) => {
          setEditAsyncValues(values);
          setIsLoadingEditValues(false);
        })
        .catch(() => {
          setEditAsyncValues([]);
          setIsLoadingEditValues(false);
        });
    }
  };

  const handleClosePopover = () => {
    setEditingType(null);
    setEditSearchQuery("");
    setEditAsyncValues([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 text-sm">
      <span className="text-foreground bg-accent/50 rounded-l-xs px-1">
        {categoryLabel}
      </span>
      {query.operator && (
        <Popover
          open={editingType === "operator"}
          onOpenChange={(open) => !open && handleClosePopover()}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={handleEditOperator}
              className={cn(
                "hover:bg-accent/80 bg-accent/50 text-accent-foreground flex cursor-pointer items-center px-1 transition-colors",
                {
                  "rounded-r-xs": isSelfClearing,
                },
              )}
            >
              <span className="text-accent-foreground">{operatorLabel}</span>
              {isSelfClearing && (
                <div
                  role="button"
                  onClick={() => onRemove(index)}
                  className="hover:text-destructive ml-2 size-3 cursor-pointer opacity-70 hover:opacity-100"
                >
                  <X className="size-3" />
                </div>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[250px] p-0"
            boxProps={{
              style: {
                background: "bg-popover",
                content: "p-0",
              },
              text: {
                topLeft: "Operators",
              },
            }}
          >
            <Command shouldFilter={false} className="space-y-2">
              <CommandInput
                box={{
                  style: {
                    background: "bg-transparent",
                  },
                }}
                value={editSearchQuery}
                onChange={(e) => setEditSearchQuery(e.target.value)}
              />
              <CommandList>
                {(() => {
                  const categoryOption = options.find(
                    (opt) => opt.category === query.category,
                  );
                  if (!categoryOption) return null;
                  const availableOps = getOperatorsForType(categoryOption.type);
                  return availableOps
                    .filter((op) =>
                      editSearchQuery
                        ? op.label
                            .toLowerCase()
                            .includes(editSearchQuery.toLowerCase())
                        : true,
                    )
                    .map((operator) => (
                      <CommandItem
                        key={operator.value}
                        onSelect={() => {
                          onEditOperator(operator.value);
                          handleClosePopover();
                        }}
                      >
                        {operator.label}
                      </CommandItem>
                    ));
                })()}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      {!isSelfClearing && (
        <Popover
          open={editingType === "value"}
          onOpenChange={(open) => !open && handleClosePopover()}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={handleEditValue}
              className="hover:bg-accent/80 bg-accent/50 text-accent-foreground flex cursor-pointer items-center rounded-r-xs px-1 transition-colors"
            >
              {valueLabel ? (
                <>
                  <span className="text-accent-foreground">{valueLabel}</span>
                  <div
                    role="button"
                    onClick={() => onRemove(index)}
                    className="hover:text-destructive ml-2 size-3 cursor-pointer opacity-70 hover:opacity-100"
                  >
                    <X className="size-3" />
                  </div>
                </>
              ) : (
                <span className="text-muted-foreground text-sm italic">
                  (Select value)
                </span>
              )}
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
                topLeft: "Options",
              },
            }}
          >
            <Command shouldFilter={false} className="space-y-2">
              <CommandInput
                placeholder="Search values..."
                value={editSearchQuery}
                onChange={(e) => setEditSearchQuery(e.target.value)}
              />
              <CommandList>
                {isLoadingEditValues ? (
                  <div className="text-muted-foreground flex items-center justify-center py-6 text-sm">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  <>
                    {(() => {
                      const categoryOption = options.find(
                        (opt) => opt.category === query.category,
                      );
                      if (!categoryOption) return null;

                      const displayValues =
                        categoryOption.useAsyncValues && onFetchValues
                          ? editAsyncValues
                          : categoryOption.values;

                      return displayValues
                        .filter((valueOption) =>
                          editSearchQuery
                            ? valueOption.label
                                .toLowerCase()
                                .includes(editSearchQuery.toLowerCase())
                            : true,
                        )
                        .map((valueOption) => (
                          <CommandItem
                            key={valueOption.value}
                            onSelect={() => {
                              onEditValue(valueOption.value, valueOption.label);
                              handleClosePopover();
                            }}
                          >
                            {valueOption.icon}
                            {valueOption.label}
                          </CommandItem>
                        ));
                    })()}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
