import { AssertionError } from './AssertionError';
import { createAsserterThatThrowsType } from './createAsserterThatThrowsType';

export const assert = createAsserterThatThrowsType(AssertionError);
