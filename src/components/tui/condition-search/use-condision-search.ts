import { useState, useEffect, useRef, useCallback } from "react";
import { OPERATORS as OPERATORS_CONFIG } from "@/lib/operators";
import type {
  StructuredQuery,
  ConditionSearchOption,
  ConditionSearchOptionValue,
} from "./types";
import { getOperatorsForType } from "./utils";

type UseConditionSearchProps = {
  options: ConditionSearchOption[];
  value?: StructuredQuery[];
  onChange?: (queries: StructuredQuery[]) => void;
  onSearch?: (queries: StructuredQuery[], textQuery: string) => void;
  onFetchValues?: (
    category: string,
    searchQuery: string,
  ) => Promise<ConditionSearchOptionValue[]>;
  debounceMs?: number;
};

export const useConditionSearch = ({
  options,
  value = [],
  onChange,
  onSearch,
  onFetchValues,
  debounceMs = 300,
}: UseConditionSearchProps) => {
  const [structuredQuery, setStructuredQuery] =
    useState<StructuredQuery[]>(value);
  const [textQuery, setTextQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [asyncValues, setAsyncValues] = useState<ConditionSearchOptionValue[]>(
    [],
  );
  const [isLoadingValues, setIsLoadingValues] = useState(false);
  const [valueSearchQuery, setValueSearchQuery] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value !== structuredQuery) {
      setStructuredQuery(value);
    }
  }, [value]);

  const currentCategory = options.find(
    (opt) => opt.category === selectedCategory,
  );

  useEffect(() => {
    if (selectedCategory && selectedOperator) {
      setValueSearchQuery(textQuery);
    }
  }, [textQuery, selectedCategory, selectedOperator]);

  useEffect(() => {
    if (
      !selectedCategory ||
      !selectedOperator ||
      !onFetchValues ||
      !currentCategory?.useAsyncValues
    ) {
      setAsyncValues([]);
      setIsLoadingValues(false);
      return;
    }

    const operatorConfig =
      OPERATORS_CONFIG[selectedOperator as keyof typeof OPERATORS_CONFIG];
    const requiresValue = !operatorConfig?.selfClearing;

    if (!requiresValue) {
      setAsyncValues([]);
      setIsLoadingValues(false);
      return;
    }

    const searchQuery =
      selectedCategory && selectedOperator ? textQuery : valueSearchQuery;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsLoadingValues(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const values = await onFetchValues(selectedCategory, searchQuery);
        setAsyncValues(values);
      } catch (error) {
        console.error("Error fetching values:", error);
        setAsyncValues([]);
      } finally {
        setIsLoadingValues(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    selectedCategory,
    selectedOperator,
    valueSearchQuery,
    textQuery,
    onFetchValues,
    debounceMs,
    currentCategory,
  ]);

  const getCategoryLabel = useCallback(
    (category: string) => {
      return (
        options.find((opt) => opt.category === category)?.label || category
      );
    },
    [options],
  );

  const getValueLabel = useCallback(
    (category: string, value: string) => {
      const option = options.find((opt) => opt.category === category);
      const valueOption = option?.values.find((v) => v.value === value);
      return valueOption?.label || value;
    },
    [options],
  );

  const handleSelectCategory = useCallback(
    (category: string) => {
      const categoryOption = options.find((opt) => opt.category === category);
      if (!categoryOption) return;

      setSelectedCategory(category);
      setValueSearchQuery("");
      setAsyncValues([]);

      const availableOperators = getOperatorsForType(categoryOption.type);

      if (availableOperators.length > 0) {
        const firstOperator = availableOperators[0]!.value;
        setSelectedOperator(firstOperator);

        const operatorConfig =
          OPERATORS_CONFIG[firstOperator as keyof typeof OPERATORS_CONFIG];
        const requiresValue = !operatorConfig?.selfClearing;

        const hasStaticValues = categoryOption.values.length > 0;
        const usesAsyncValues = categoryOption.useAsyncValues && onFetchValues;

        const newQuery: StructuredQuery = {
          category,
          operator: firstOperator,
          value: "",
          label: getCategoryLabel(category),
          valueLabel: "",
        };
        const newQueries = [...structuredQuery, newQuery];
        setStructuredQuery(newQueries);
        onChange?.(newQueries);

        if (!requiresValue || (!hasStaticValues && !usesAsyncValues)) {
          setSelectedCategory(null);
          setSelectedOperator(null);
          setTextQuery("");
        } else {
          setTextQuery("");
        }
      } else {
        setSelectedOperator(null);
      }
    },
    [options, structuredQuery, onChange, getCategoryLabel, onFetchValues],
  );

  const handleSelectOperator = useCallback(
    (operator: string) => {
      setSelectedOperator(operator);
      const category = options.find((opt) => opt.category === selectedCategory);
      if (category) {
        const operatorConfig =
          OPERATORS_CONFIG[operator as keyof typeof OPERATORS_CONFIG];
        const requiresValue = !operatorConfig?.selfClearing;

        const hasStaticValues = category.values.length > 0;
        const usesAsyncValues = category.useAsyncValues && onFetchValues;

        if (!requiresValue || (!hasStaticValues && !usesAsyncValues)) {
          const newQuery: StructuredQuery = {
            category: selectedCategory!,
            operator,
            value: "",
            label: getCategoryLabel(selectedCategory!),
            valueLabel: "",
          };
          const newQueries = [...structuredQuery, newQuery];
          setStructuredQuery(newQueries);
          onChange?.(newQueries);
          setSelectedCategory(null);
          setSelectedOperator(null);
          setValueSearchQuery("");
          setAsyncValues([]);
        } else if (usesAsyncValues) {
          setValueSearchQuery("");
        }
      }
    },
    [
      options,
      selectedCategory,
      structuredQuery,
      onChange,
      getCategoryLabel,
      onFetchValues,
    ],
  );

  const handleSelectValue = useCallback(
    (value: string, valueLabel?: string) => {
      if (selectedCategory && selectedOperator) {
        const label =
          valueLabel ||
          getValueLabel(selectedCategory, value) ||
          asyncValues.find((v) => v.value === value)?.label ||
          value;

        const filterIndex = structuredQuery.findIndex(
          (q) =>
            q.category === selectedCategory &&
            q.operator === selectedOperator &&
            q.value === "",
        );

        if (filterIndex >= 0) {
          const updatedQueries = [...structuredQuery];
          const existingQuery = updatedQueries[filterIndex];
          if (existingQuery) {
            updatedQueries[filterIndex] = {
              category: existingQuery.category,
              operator: existingQuery.operator,
              value,
              label: existingQuery.label,
              valueLabel: label,
            };
            setStructuredQuery(updatedQueries);
            onChange?.(updatedQueries);
          }
        } else {
          const newQuery: StructuredQuery = {
            category: selectedCategory,
            operator: selectedOperator,
            value,
            label: getCategoryLabel(selectedCategory),
            valueLabel: label,
          };
          const newQueries = [...structuredQuery, newQuery];
          setStructuredQuery(newQueries);
          onChange?.(newQueries);
        }

        setSelectedCategory(null);
        setSelectedOperator(null);
        setValueSearchQuery("");
        setTextQuery("");
        setAsyncValues([]);
      }
    },
    [
      selectedCategory,
      selectedOperator,
      structuredQuery,
      onChange,
      getCategoryLabel,
      getValueLabel,
      asyncValues,
    ],
  );

  const handleRemoveFilter = useCallback(
    (index: number) => {
      const newQueries = structuredQuery.filter((_, i) => i !== index);
      setStructuredQuery(newQueries);
      onChange?.(newQueries);
    },
    [structuredQuery, onChange],
  );

  const handleEditOperator = useCallback(
    (index: number, operator: string) => {
      const updatedQueries = [...structuredQuery];
      const existingQuery = updatedQueries[index];
      if (existingQuery) {
        const operatorConfig =
          OPERATORS_CONFIG[operator as keyof typeof OPERATORS_CONFIG];
        const isSelfClearing = operatorConfig?.selfClearing ?? false;

        updatedQueries[index] = {
          ...existingQuery,
          operator,
          value: isSelfClearing ? "" : existingQuery.value,
          valueLabel: isSelfClearing ? "" : existingQuery.valueLabel,
        };
        setStructuredQuery(updatedQueries);
        onChange?.(updatedQueries);
      }
    },
    [structuredQuery, onChange],
  );

  const handleEditValue = useCallback(
    (index: number, value: string, valueLabel?: string) => {
      const updatedQueries = [...structuredQuery];
      const existingQuery = updatedQueries[index];
      if (existingQuery) {
        const label =
          valueLabel || getValueLabel(existingQuery.category, value) || value;
        updatedQueries[index] = {
          ...existingQuery,
          value,
          valueLabel: label,
        };
        setStructuredQuery(updatedQueries);
        onChange?.(updatedQueries);
      }
    },
    [structuredQuery, onChange, getValueLabel],
  );

  const handleClearAll = useCallback(() => {
    setStructuredQuery([]);
    setTextQuery("");
    onChange?.([]);
  }, [onChange]);

  function cleanupInvalidConditions() {
    const validQueries = structuredQuery.filter((query) => {
      const operatorConfig =
        OPERATORS_CONFIG[query.operator as keyof typeof OPERATORS_CONFIG];
      const isSelfClearing = operatorConfig?.selfClearing ?? false;

      return isSelfClearing || query.value;
    });

    if (validQueries.length !== structuredQuery.length) {
      setStructuredQuery(validQueries);
      onChange?.(validQueries);
    }
  }

  const handleSearch = useCallback(() => {
    cleanupInvalidConditions();
    onSearch?.(structuredQuery, textQuery);
  }, [onSearch, structuredQuery, textQuery]);

  const getDisplayValues = useCallback(() => {
    if (!currentCategory) return [];
    if (currentCategory.useAsyncValues && onFetchValues) {
      return asyncValues;
    }
    return currentCategory.values;
  }, [currentCategory, asyncValues, onFetchValues]);

  return {
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
  };
};
