interface Limit {
  disableAt?: number | null;
  status?: 'disabled' | 'maxExceeded' | 'ok' | 'warn' | null;
  warnAt?: number | null;
}

export const isAtOrOverLimit = (limit?: Limit | null): boolean => {
  const status = limit?.status;
  return status === 'disabled' || status === 'maxExceeded';
};
