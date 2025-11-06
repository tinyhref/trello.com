import type {
  ComponentType,
  ForwardRefRenderFunction,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import { forwardRef } from 'react';

export type ForwardedComponent<T, TProp> = ComponentType<
  PropsWithoutRef<TProp> & RefAttributes<T>
>;

export const forwardRefComponent = <T, TProp>(
  displayName: string,
  fn: ForwardRefRenderFunction<T, PropsWithoutRef<TProp>>,
): ForwardedComponent<T, TProp> => {
  fn.displayName = displayName;

  return forwardRef<T, TProp>(fn);
};
