const idRegex = new RegExp(`^[a-f0-9]*$`);

export function checkId(value: string) {
  return (
    // eslint-disable-next-line eqeqeq
    (value != null ? value.constructor.name : undefined) === 'ObjectID' ||
    // eslint-disable-next-line eqeqeq
    ((value != null ? value.length : undefined) === 24 && idRegex.test(value))
  );
}
