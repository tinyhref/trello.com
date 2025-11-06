// ID's provided by Feedback Collector team (#feedback-collectors).
export const AdvancedSearchPageEntryPointId =
  '2c1d0437-5e48-4c13-99a6-7debecfa3fa4' as const;
export const AiLabsEntryPointId =
  '7444d623-786d-437d-804d-531c84eee570' as const;
export const EditorAIEntryPointId =
  '73cf1eae-42a3-418a-a7ac-976ba0b5735d' as const;
export const EmailToBoardAIEntryPointId =
  '825d733c-39a4-4364-b9af-a2e7c745f7f9' as const;
export const SmartListsEntryPointId =
  'e4864f5b-2b6a-4ed0-a8d4-3aae1dc236fc' as const;
export const PersonalProductivityEntryPointId =
  '213c494c-7895-4dfc-85c5-ac196c626ff3' as const;
export const PowerUpListingUpdatesEntryPointId =
  '6489dc85-f00e-4115-af22-bf3a0b3de876' as const;
export const TrelloOAuth2EntryPointId =
  '386b4427-b2ba-473d-a181-eb736abf4dfb' as const;

export type EntrypointId =
  | typeof AdvancedSearchPageEntryPointId
  | typeof AiLabsEntryPointId
  | typeof EditorAIEntryPointId
  | typeof EmailToBoardAIEntryPointId
  | typeof PersonalProductivityEntryPointId
  | typeof PowerUpListingUpdatesEntryPointId
  | typeof SmartListsEntryPointId
  | typeof TrelloOAuth2EntryPointId;
