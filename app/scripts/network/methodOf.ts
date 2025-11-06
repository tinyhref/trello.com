export const methodOf = function (opts: {
  type?: string | null;
  method?: string | null;
}) {
  const left = opts.type ? opts.type : opts.method;
  return (left ?? 'GET').toUpperCase();
};
