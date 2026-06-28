export type NumericOperator = ">" | "<" | ">=" | "<=" | "=" | "between";
export type StringOperator = "equals" | "contains" | "startsWith";
export type ArrayOperator = "includes" | "includesAny" | "includesAll";
export type BooleanOperator = "is";

export type FilterOperator =
  | NumericOperator
  | StringOperator
  | ArrayOperator
  | BooleanOperator;
