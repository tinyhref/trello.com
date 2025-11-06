import customError from '@atlassian/trello-error-ext';

import { assert } from './assert';

const reservedBaseName = 'Error';

export const makeErrorEnum = (namespace: string, names: string[]) => {
  const baseClass = customError([namespace, reservedBaseName].join('::'));

  for (const name of Array.from(names)) {
    assert(name !== reservedBaseName, `${name} is the reserved base name!`);
    assert(
      !(name in baseClass),
      `You can't use ${name} as the name of a custom error`,
    );
    baseClass[name] = customError([namespace, name].join('::'), {}, baseClass);
  }

  return baseClass;
};
