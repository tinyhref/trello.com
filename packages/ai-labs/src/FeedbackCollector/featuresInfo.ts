export type FeatureNames = 'smartScheduling';

export type Facet = {
  buttonText: string;
  name: string;
};

export type FeatureInfo = {
  negativeFacets: Facet[];
};

export const featuresInfo: Record<FeatureNames, FeatureInfo> = {
  smartScheduling: {
    negativeFacets: [
      { buttonText: 'Duration of event', name: 'duration' },
      { buttonText: 'Time slot', name: 'time' },
      { buttonText: 'Date of event', name: 'date' },
      { buttonText: 'Priority of events', name: 'priority' },
      { buttonText: 'LLM took too long', name: 'tooLong' },
    ],
  },
};
