interface ConstructableError<T> {
  new (message: string): T;
}

export function createAsserterThatThrowsType<T>(
  TypedError: ConstructableError<T>,
) {
  return function (test: boolean, message: string = 'assertion failed') {
    if (!test) {
      throw new TypedError(message);
    }
  };
}
