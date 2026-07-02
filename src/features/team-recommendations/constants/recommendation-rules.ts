import { RecommendationCategory } from "../types/recommendation.types";

export const BULK_THRESHOLD = 225; // Combined average of HP + Def + SpD
export const SPEED_THRESHOLD = 75; // Average Speed

export const CATEGORY_PRIORITY: Record<RecommendationCategory, number> = {
  "Empty Team": 1,
  "Empty Slots": 2,
  "Defensive Weaknesses": 3,
  "Missing Roles": 4,
  "Offensive Gaps": 5,
  "Duplicate Types": 6,
  "Low Speed": 7,
  "Low Bulk": 8,
  "Team Balance": 9,
  "Type Coverage": 10,
};

export const SEVERITY_VALUE = {
  high: 3,
  medium: 2,
  low: 1,
};
