// Marketing attributes to extract from the URL from which the marketing event is fired.
// List compiled by Atlassian Marketing Engineering here:
// https://hello.atlassian.net/wiki/spaces/GTMDE/pages/1357221110/Analysis+Trello+hybrid+pages+and+UGC
// eslint-disable-next-line @trello/enforce-variable-case
const StaticAttributes = [
  // utm fields
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  // marketing identifiers
  'fbclid',
  'gclid',
  'gclsrc',
  'msclkid',
  // marketing fields
  'adposition',
  'adgroup',
  'campaign',
  'creative',
  'device',
  'keyword',
  'matchtype',
  'network',
  'placement',
];

// Attributes to extract from the url if they match the pattern
// eslint-disable-next-line @trello/enforce-variable-case
const DynamicAttributePatterns = [/\w+id/, /ds_\w+/, /dcm_\w+/];
const isParamMarketingAttribute = (param: string): boolean => {
  return DynamicAttributePatterns.some((pattern): boolean => {
    return new RegExp(pattern).test(param);
  });
};

export const getSearchParamsMarketingAttributes = (
  url: URL,
): Record<string, string> => {
  const searchParams = url.searchParams;
  const attributes: Record<string, string> = {};
  for (const [key, value] of searchParams) {
    if (
      // Look for exact + pattern matches
      (StaticAttributes.includes(key) || isParamMarketingAttribute(key)) &&
      value
    ) {
      attributes[key] = value;
    }
  }
  return attributes;
};
