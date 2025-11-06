export type LimitType =
  | 'attachments.perBoard'
  | 'cards.openPerBoard'
  | 'cards.totalPerBoard'
  | 'checklists.perBoard'
  | 'labels.perBoard'
  | 'lists.openPerBoard'
  | 'lists.totalPerBoard';
export type LimitStatus = 'disabled' | 'maxExceeded' | 'ok' | 'warn';

interface Limit {
  count?: number;
  disableAt: number;
  status: LimitStatus;
  warnAt: number;
}

export interface SimplifiedLimit {
  key: LimitType;
  status: LimitStatus;
  count: number | undefined;
}

type ModelLimit = Record<string, Limit | null | undefined>;
export type ViewLimit = Record<string, ModelLimit | null | undefined>;

export const filterByKeys = function (
  limits: ViewLimit | null = null,
  keys: string[] = [],
): SimplifiedLimit[] {
  if (limits === null) {
    return [];
  }

  return keys
    .map(function (key: string) {
      const [model, limitType] = key.split('.');
      const result = limits?.[model]?.[limitType];
      if (result?.status) {
        return {
          key,
          status: result.status,
          count: result.count,
        };
      }
      return undefined;
    })
    .filter((result) => Boolean(result)) as SimplifiedLimit[];
};

const statusToSeverity: Record<LimitStatus, number> = {
  maxExceeded: 0,
  disabled: 1,
  warn: 2,
  ok: 3,
};

export const sortBySeverity = (limits: SimplifiedLimit[]) => {
  const result = [...limits];
  return result.sort(
    (a, b) => statusToSeverity[a.status] - statusToSeverity[b.status],
  );
};

export const isOverLimit = (
  limitName: string,
  limitType: string,
  limits: ViewLimit | null = null,
): boolean => {
  if (limits === null) {
    // Fail open, the server will reject if we're over
    return false;
  }

  return Object.entries(limits).some(([key, data]) => {
    const status = data?.[limitType]?.status;
    return (
      key.indexOf(limitName) === 0 &&
      (status === 'disabled' || status === 'maxExceeded')
    );
  });
};
