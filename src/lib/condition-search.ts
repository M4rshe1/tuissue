import { OPERATORS } from "@/lib/enums";

export function convertOperatorToPrisma(operator: string, inputValue: string) {
  switch (operator) {
    case OPERATORS.IS_EMPTY:
      return {
        OR: [{ equals: "" }, { equals: null }, { equals: undefined }],
      };
    case OPERATORS.IS_NOT_EMPTY:
      return {
        not: { OR: [{ equals: "" }, { equals: null }, { equals: undefined }] },
      };
  }

  const value = JSON.parse(inputValue);
  switch (operator) {
    case OPERATORS.EQUALS:
      return { equals: value };
    case OPERATORS.NOT_EQUALS:
      return { not: { equals: value } };
    case OPERATORS.CONTAINS:
      return { contains: value, mode: "insensitive" };
    case OPERATORS.STARTS_WITH:
      return { startsWith: value, mode: "insensitive" };
    case OPERATORS.ENDS_WITH:
      return { endsWith: value, mode: "insensitive" };
    case OPERATORS.NOT_CONTAINS:
      return { not: { contains: value, mode: "insensitive" } };
    case OPERATORS.NOT_STARTS_WITH:
      return { not: { startsWith: value, mode: "insensitive" } };
    case OPERATORS.NOT_ENDS_WITH:
      return { not: { endsWith: value, mode: "insensitive" } };
    case OPERATORS.LESS_THAN:
      return { lt: value };
    case OPERATORS.GREATER_THAN:
      return { gt: value };
    case OPERATORS.LESS_THAN_OR_EQUALS:
      return { lte: value };
    case OPERATORS.GREATER_THAN_OR_EQUALS:
      return { gte: value };
    case OPERATORS.IS_IN:
      return { in: value };
    case OPERATORS.IS_NOT_IN:
      return { not: { in: value } };

    default:
      throw new Error("Invalid operator");
  }
}

export function valueIsValid(operator: string, value: string) {
  switch (operator) {
    case OPERATORS.IS_EMPTY:
      return value === "";
    case OPERATORS.IS_NOT_EMPTY:
      return value !== "";
  }
  try {
    JSON.parse(value);
  } catch {
    return false;
  }
  return true;
}
