import { ActionErrorExtensions } from './action';
import { BoardErrorExtensions, BoardErrors } from './boards';
import { EnterpriseErrorExtensions, EnterpriseErrors } from './enterprise';
import { ListErrorExtensions, ListErrors } from './lists';
import { MemberErrorExtensions, MemberErrors } from './members';
import {
  OrganizationErrorExtensions,
  OrganizationErrors,
} from './organizations';
import { PaidAccountErrorExtensions } from './paidAccount';
import { PluginErrorExtensions } from './plugins';
import { PromoCodeErrorExtensions } from './promoCodes';
import { PromotionErrorExtensions } from './promotions';
import { RequestAccessErrors, RequestAccessExtensions } from './requestAccess';

const unknownErrorExtensions = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const Errors = {
  ...BoardErrors,
  ...ListErrors,
  ...OrganizationErrors,
  ...RequestAccessErrors,
  ...EnterpriseErrors,
  ...MemberErrors,
} as const;

export const ErrorExtensions = {
  ...ListErrorExtensions,
  ...OrganizationErrorExtensions,
  ...PaidAccountErrorExtensions,
  ...PluginErrorExtensions,
  ...PromoCodeErrorExtensions,
  ...PromotionErrorExtensions,
  ...ActionErrorExtensions,
  ...BoardErrorExtensions,
  ...RequestAccessExtensions,
  ...EnterpriseErrorExtensions,
  ...MemberErrorExtensions,
  ...unknownErrorExtensions,
} as const;

export type ErrorType = keyof typeof Errors;
export type ErrorExtensionsType = keyof typeof ErrorExtensions;
export {
  BoardErrorExtensions,
  EnterpriseErrorExtensions,
  EnterpriseErrors,
  MemberErrorExtensions,
  OrganizationErrorExtensions,
  OrganizationErrors,
  PaidAccountErrorExtensions,
  RequestAccessExtensions,
};
