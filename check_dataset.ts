import { CANDIDATE_DATASET } from './src/features/team-suggestions/constants/suggestion-rules';
CANDIDATE_DATASET.forEach((c, i) => {
  if (!c.roles) {
    console.log(`Candidate at index ${i} (${c.name}) is missing roles!`);
  } else if (!Array.isArray(c.roles)) {
    console.log(`Candidate at index ${i} (${c.name}) roles is not an array!`);
  }
});
