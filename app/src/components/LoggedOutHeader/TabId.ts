export const TabId = {
  Features: 0,
  Solutions: 1,
  Plans: 2,
  Pricing: 3,
  Resources: 4,
} as const;
export type TabIdValue = (typeof TabId)[keyof typeof TabId];
