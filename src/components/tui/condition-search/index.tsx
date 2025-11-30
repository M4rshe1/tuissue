"use client";

import { Box, type BoxProps } from "../box";
import { XCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { FilterTag } from "./filter-tag";
import { AddFilterButton } from "./add-filter-button";
import { SearchInput } from "./search-input";
import { useConditionSearch } from "./use-condision-search";
import { getOperatorLabel } from "./utils";
import type { ConditionSearchProps } from "./types";

export * from "./types";

export const ConditionSearch = ({
  options,
  value = [],
  onChange,
  onSearch,
  placeholder,
  onFetchValues,
  debounceMs = 300,
  boxProps,
}: ConditionSearchProps & { boxProps?: BoxProps }) => {
  const {
    structuredQuery,
    textQuery,
    setTextQuery,
    selectedCategory,
    selectedOperator,
    asyncValues,
    isLoadingValues,
    valueSearchQuery,
    setValueSearchQuery,
    getCategoryLabel,
    getValueLabel,
    handleSelectCategory,
    handleSelectOperator,
    handleSelectValue,
    handleRemoveFilter,
    handleEditOperator,
    handleEditValue,
    handleClearAll,
    handleSearch,
    getDisplayValues,
  } = useConditionSearch({
    options,
    value,
    onChange,
    onSearch,
    onFetchValues,
    debounceMs,
  });

  return (
    <Box
      {...boxProps}
      style={{
        ...boxProps?.style,
        content: cn(
          "flex items-center gap-2 flex-wrap",
          boxProps?.style?.content,
        ),
      }}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {structuredQuery.map((query, index) => {
          const categoryLabel = query.label || getCategoryLabel(query.category);
          const operatorLabel = getOperatorLabel(query.operator);
          const valueLabel =
            query.valueLabel || getValueLabel(query.category, query.value);

          return (
            <FilterTag
              key={index}
              query={query}
              index={index}
              categoryLabel={categoryLabel}
              operatorLabel={operatorLabel}
              valueLabel={valueLabel}
              options={options}
              onRemove={handleRemoveFilter}
              onEditOperator={(operator) => handleEditOperator(index, operator)}
              onEditValue={(value, valueLabel) =>
                handleEditValue(index, value, valueLabel)
              }
              onFetchValues={onFetchValues}
            />
          );
        })}
        <AddFilterButton
          options={options}
          onSelectCategory={handleSelectCategory}
          onSelectOperator={handleSelectOperator}
          onSelectValue={handleSelectValue}
          onFetchValues={onFetchValues}
          asyncValues={asyncValues}
          isLoadingValues={isLoadingValues}
          valueSearchQuery={valueSearchQuery}
          onValueSearchQueryChange={setValueSearchQuery}
        />
        <SearchInput
          value={textQuery}
          onChange={setTextQuery}
          onSelectCategory={handleSelectCategory}
          onSelectValue={handleSelectValue}
          onSearch={handleSearch}
          placeholder={placeholder}
          options={options}
          selectedCategory={selectedCategory}
          selectedOperator={selectedOperator}
          displayValues={getDisplayValues()}
          isLoadingValues={isLoadingValues}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          size="xs"
          variant="ghost"
          onClick={handleClearAll}
          aria-label="Clear all"
        >
          <XCircle className="size-4" />
        </Button>
        <Button
          type="button"
          size="xs"
          variant="ghost"
          onClick={handleSearch}
          aria-label="Search"
        >
          <Search className="size-4" />
        </Button>
      </div>
    </Box>
  );
};

export default ConditionSearch;
