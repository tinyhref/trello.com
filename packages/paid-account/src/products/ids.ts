// eslint-disable-next-line @trello/enforce-variable-case
const PremiumV3_3 = {
  monthly: 110,
  yearly: 111,
} as const;

// eslint-disable-next-line @trello/enforce-variable-case
const StandardV1 = {
  monthly: 119,
  yearly: 116,
} as const;

// eslint-disable-next-line @trello/enforce-variable-case
const PremiumPO = {
  v3_3: 112,
} as const;

// eslint-disable-next-line @trello/enforce-variable-case
const Enterprise = {
  v1: 100,
  v1_1: 108,
  v1_2: 109,
  v2_0: 113,
  v2_1: 114,
  v2_2: 120,
} as const;

export type ProductId =
  | (typeof Enterprise)[keyof typeof Enterprise]
  | (typeof PremiumPO)[keyof typeof PremiumPO]
  | (typeof PremiumV3_3)[keyof typeof PremiumV3_3]
  | (typeof StandardV1)[keyof typeof StandardV1];

export const Products = {
  Organization: {
    Premium: {
      v3_3: PremiumV3_3,
      current: PremiumV3_3,
    },
    Standard: {
      v1: StandardV1,
    },
  },
  PremiumPO,
  Enterprise,
} as const;
