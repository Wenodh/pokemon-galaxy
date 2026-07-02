import { Recommendation } from "../types/recommendation.types";
import { CATEGORY_PRIORITY, SEVERITY_VALUE } from "../constants/recommendation-rules";

export function rankRecommendations(recommendations: Recommendation[]): Recommendation[] {
  return [...recommendations].sort((a, b) => {
    // 1. Severity (High > Medium > Low)
    const severityDiff = SEVERITY_VALUE[b.severity] - SEVERITY_VALUE[a.severity];
    if (severityDiff !== 0) return severityDiff;

    // 2. Category Priority
    const priorityA = CATEGORY_PRIORITY[a.category] || 99;
    const priorityB = CATEGORY_PRIORITY[b.category] || 99;
    const priorityDiff = priorityA - priorityB;
    if (priorityDiff !== 0) return priorityDiff;

    // 3. Deterministic tie-breaker (Title)
    return a.title.localeCompare(b.title);
  });
}
