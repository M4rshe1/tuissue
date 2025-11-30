import { OPERATORS as OPERATORS_CONFIG, type Operator } from "@/lib/operators";

// Helper function to get operators for a given type
export const getOperatorsForType = (type: string): Operator[] => {
  return Object.values(OPERATORS_CONFIG).filter((operator) => {
    if (operator.types === "ALL") return true;
    return operator.types.includes(type);
  });
};

// Helper function to get operator label
export const getOperatorLabel = (operatorValue: string): string => {
  const operator = Object.values(OPERATORS_CONFIG).find(
    (op) => op.value === operatorValue,
  );
  return operator?.label || operatorValue;
};
