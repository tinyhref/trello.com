import { defineMessages, type MessageDescriptor } from 'react-intl';

import type { ErrorCode, ErrorModel } from './errorTypes';

/**
 * Gets the default error messages for unknown errors.
 * @returns A record containing default error message descriptors.
 */
const getDefaultErrorMessages = (): Record<string, MessageDescriptor> =>
  defineMessages({
    UNKNOWN_ERROR: {
      id: 'error handling.enterprise.UNKNOWN_ERROR',
      defaultMessage: 'Unknown error occurred.',
      description: 'Default error message when an unknown error occurs',
    },
  });

/**
 * Gets error messages specific to organization-related errors.
 * @returns A record containing organization error message descriptors.
 */
const getOrganizationErrorMessages = (): Record<string, MessageDescriptor> =>
  defineMessages({
    TEST_KEY: {
      id: 'error handling.organization.TEST_KEY',
      defaultMessage: 'Short name is taken.',
      description:
        'Error message when organization short name is already taken',
    },
    ORG_NAME_TAKEN: {
      id: 'error handling.organization.ORG_NAME_TAKEN',
      defaultMessage: 'Short name is taken.',
      description:
        'Error message when organization short name is already taken',
    },
    ORG_NAME_RESERVED: {
      id: 'error handling.organization.ORG_NAME_RESERVED',
      defaultMessage:
        'Short name can\'t contain "admin", "auth", "Trello", or "Butler".',
      description:
        'Error message when organization short name contains reserved words',
    },
    ORG_NAME_SHORT: {
      id: 'error handling.organization.ORG_NAME_SHORT',
      defaultMessage: 'Name is too short.',
      description: 'Error message when organization name is too short',
    },
    ORG_NAME_INVALID: {
      id: 'error handling.organization.ORG_NAME_INVALID',
      defaultMessage: 'Name is invalid.',
      description: 'Error message when organization name is invalid',
    },
    ORG_DISPLAY_NAME_SHORT: {
      id: 'error handling.organization.ORG_DISPLAY_NAME_SHORT',
      defaultMessage: 'Display name is too short.',
      description: 'Error message when organization display name is too short',
    },
    ORG_DISPLAY_NAME_LONG: {
      id: 'error handling.organization.ORG_DISPLAY_NAME_LONG',
      defaultMessage: 'Display name can not be more than 100 characters.',
      description: 'Error message when organization display name is too long',
    },
    ORG_SHORT_NAME_LONG: {
      id: 'error handling.organization.ORG_SHORT_NAME_LONG',
      defaultMessage: 'Short name cannot be more than 100 characters.',
      description: 'Error message when organization short name is too long',
    },
    ORG_INVALID_TEAM_TYPE: {
      id: 'error handling.organization.ORG_INVALID_TEAM_TYPE',
      defaultMessage: 'Invalid Workspace type selected.',
      description: 'Error message when invalid workspace type is selected',
    },
    GM_ERROR: {
      id: 'error handling.organization.GM_ERROR',
      defaultMessage: 'Not a valid image format.',
      description: 'Error message when uploaded image format is invalid',
    },
    COULD_NOT_ADD_FREE_TRIAL: {
      id: 'error handling.organization.COULD_NOT_ADD_FREE_TRIAL',
      defaultMessage: 'Could not add free trial',
      description:
        'Error message when free trial cannot be added to organization',
    },
    UNKNOWN_ERROR: {
      id: 'error handling.organization.UNKNOWN_ERROR',
      defaultMessage: 'Unknown error occurred.',
      description:
        'Error message when an unknown error occurs in organization context',
    },
    NO_PERMISSION_TO_DELETE_WORKSPACE: {
      id: 'error handling.organization.NO_PERMISSION_TO_DELETE_WORKSPACE',
      defaultMessage:
        "You can't delete this Workspace. Contact Trello Support for help.",
      description:
        'Error message when user lacks permission to delete workspace',
    },
    ENTERPRISE_DEACTIVATED_IN_ENTERPRISE: {
      id: 'error handling.organization.ENTERPRISE_DEACTIVATED_IN_ENTERPRISE',
      defaultMessage: 'No invite sent to deactivated member',
      description:
        'Error message when trying to invite deactivated member to enterprise',
    },
    NOT_OWNED_BY_ENTERPRISE: {
      id: 'error handling.organization.NOT_OWNED_BY_ENTERPRISE',
      defaultMessage: 'No invite sent to member without SSO credentials',
      description:
        'Error message when trying to invite member without SSO credentials',
    },
    LICENSE_LIMIT_REACHED: {
      id: 'error handling.organization.LICENSE_LIMIT_REACHED',
      defaultMessage: 'Enterprise limit reached',
      description: 'Error message when enterprise license limit is reached',
    },
    ORG_NOT_ELIGIBLE: {
      id: 'error handling.organization.ORG_NOT_ELIGIBLE',
      defaultMessage:
        'At least one workspace is not eligible to join the enterprise',
      description:
        'Error message when workspace is not eligible to join enterprise',
    },
    ORGANIZATION_HAS_PUBLIC_PLUGIN: {
      id: 'error handling.organization.ORGANIZATION_HAS_PUBLIC_PLUGIN',
      defaultMessage:
        "Workspaces with publicly listed Power-Ups can't be deleted.",
      description:
        'Error message when workspace with public plugins cannot be deleted',
    },
  });

/**
 * Gets error messages specific to paid account and billing-related errors.
 * @returns A record containing paid account error message descriptors.
 */
const getPaidAccountErrorMessages = (): Record<string, MessageDescriptor> =>
  defineMessages({
    BILLING_UNCONFIRMED: {
      id: 'error handling.paidAccount.BILLING_UNCONFIRMED',
      defaultMessage: 'Please confirm your email address and try again.',
      description: 'Error message when billing email is not confirmed',
    },
    BILLING_SERVICE_UNAVAILABLE: {
      id: 'error handling.paidAccount.BILLING_SERVICE_UNAVAILABLE',
      defaultMessage:
        'Trello could not contact its payment service to complete the transaction.',
      description: 'Error message when payment service is unavailable',
    },
    BILLING_INVALID_NAME: {
      id: 'error handling.paidAccount.BILLING_INVALID_NAME',
      defaultMessage: 'Please enter a valid name.',
      description: 'Error message when billing name is invalid',
    },
    BILLING_INVALID_EMAIL: {
      id: 'error handling.paidAccount.BILLING_INVALID_EMAIL',
      defaultMessage: 'Please enter a valid email address.',
      description: 'Error message when billing email is invalid',
    },
    BILLING_INVALID_TOS: {
      id: 'error handling.paidAccount.BILLING_INVALID_TOS',
      defaultMessage:
        'You must accept the Terms of Service and Privacy Policy.',
      description: 'Error message when terms of service are not accepted',
    },
    BILLING_INVALID_COUNTRY: {
      id: 'error handling.paidAccount.BILLING_INVALID_COUNTRY',
      defaultMessage: 'Must be a valid country.',
      description: 'Error message when billing country is invalid',
    },
    BILLING_BLOCKED_COUNTRY: {
      id: 'error handling.paidAccount.BILLING_BLOCKED_COUNTRY',
      defaultMessage:
        'Following the Russian invasion of Ukraine, we are pausing the sale of new software in Russia and Belarus.',
      description:
        'Error message when billing is blocked for certain countries',
    },
    BILLING_INVALID_ZIP_CODE: {
      id: 'error handling.paidAccount.BILLING_INVALID_ZIP_CODE',
      defaultMessage: 'Please enter a valid postal code.',
      description: 'Error message when billing postal code is invalid',
    },
    BILLING_INVALID_TAX_ID: {
      id: 'error handling.paidAccount.BILLING_INVALID_TAX_ID',
      defaultMessage: 'Please enter a valid tax number.',
      description: 'Error message when billing tax ID is invalid',
    },
    BILLING_INVALID_STATE_TAX_ID: {
      id: 'error handling.paidAccount.BILLING_INVALID_STATE_TAX_ID',
      defaultMessage: 'Please enter a valid tax number.',
      description: 'Error message when billing state tax ID is invalid',
    },
    BILLING_UNSUPPORTED_CARD_TYPE: {
      id: 'error handling.paidAccount.BILLING_UNSUPPORTED_CARD_TYPE',
      defaultMessage:
        'The credit card type is not supported. Please use a different card.',
      description: 'Error message when credit card type is not supported',
    },
    BILLING_CARD_DECLINED: {
      id: 'error handling.paidAccount.BILLING_CARD_DECLINED',
      defaultMessage:
        'The card was declined. Please use a different card or contact your bank.',
      description: 'Error message when credit card is declined',
    },
    BILLING_FREE_TRIAL_NOT_APPLICABLE: {
      id: 'error handling.paidAccount.BILLING_FREE_TRIAL_NOT_APPLICABLE',
      defaultMessage: 'This Workspace is not eligible for a free trial',
      description:
        'Error message when workspace is not eligible for free trial',
    },
    BILLING_INVALID_DISCOUNT: {
      id: 'error handling.paidAccount.BILLING_INVALID_DISCOUNT',
      defaultMessage: 'This Workspace is not eligible for this promo code',
      description:
        'Error message when workspace is not eligible for promo code',
    },
    BILLING_COULD_NOT_PROCESS: {
      id: 'error handling.paidAccount.BILLING_COULD_NOT_PROCESS',
      defaultMessage:
        "We couldn't process your payment. Check your payment info and try again.",
      description: 'Error message when payment processing fails',
    },
    BILLING_SOMETHING_WENT_WRONG: {
      id: 'error handling.paidAccount.BILLING_SOMETHING_WENT_WRONG',
      defaultMessage: 'Something went wrong. Refresh the page and try again.',
      description: 'Error message when billing encounters an unknown error',
    },
    BILLING_REQUIRES_ACTION: {
      id: 'error handling.paidAccount.BILLING_REQUIRES_ACTION',
      defaultMessage:
        'The credit card was declined due to missing additional authorization, please try again and confirm charge in pop up.',
      description:
        'Error message when credit card requires additional authorization',
    },
  });

/**
 * Gets error messages specific to promotion-related errors.
 * @returns A record containing promotion error message descriptors.
 */
const getPromotionErrorMessages = (): Record<string, MessageDescriptor> =>
  defineMessages({
    PROMOTION_INVALID: {
      id: 'error handling.promotion.PROMOTION_INVALID',
      defaultMessage: 'Invalid promotion.',
      description: 'Error message when promotion is invalid',
    },
    PROMOTION_EXPIRED: {
      id: 'error handling.promotion.PROMOTION_EXPIRED',
      defaultMessage: 'This promotion is not longer available.',
      description: 'Error message when promotion has expired',
    },
    PROMOTION_ALREADY_REDEEMED: {
      id: 'error handling.promotion.PROMOTION_ALREADY_REDEEMED',
      defaultMessage: 'This promotion has already been redeemed.',
      description: 'Error message when promotion has already been redeemed',
    },
  });

/**
 * Gets error messages specific to promo code-related errors.
 * @returns A record containing promo code error message descriptors.
 */
const getPromoCodeErrorMessages = (): Record<string, MessageDescriptor> =>
  defineMessages({
    PROMO_CODE_INVALID: {
      id: 'error handling.promoCode.PROMO_CODE_INVALID',
      defaultMessage: 'Invalid promo code.',
      description: 'Error message when promo code is invalid',
    },
    PROMO_CODE_EXPIRED: {
      id: 'error handling.promoCode.PROMO_CODE_EXPIRED',
      defaultMessage: 'This promo code has expired.',
      description: 'Error message when promo code has expired',
    },
    PROMO_CODE_ALREADY_REDEEMED: {
      id: 'error handling.promoCode.PROMO_CODE_ALREADY_REDEEMED',
      defaultMessage: 'This promo code has already been redeemed.',
      description: 'Error message when promo code has already been redeemed',
    },
    PROMO_CODE_NOT_ELIGIBLE: {
      id: 'error handling.promoCode.PROMO_CODE_NOT_ELIGIBLE',
      defaultMessage: 'This promo code cannot be applied to this workspace.',
      description:
        'Error message when promo code cannot be applied to workspace',
    },
    PROMO_CODE_INVALID_BILLING_PERIOD: {
      id: 'error handling.promoCode.PROMO_CODE_INVALID_BILLING_PERIOD',
      defaultMessage:
        'This promo code cannot be applied to the selected billing plan.',
      description:
        'Error message when promo code cannot be applied to billing period',
    },
  });

/**
 * Gets error messages specific to board-related errors.
 * @returns A record containing board error message descriptors.
 */
const getBoardErrorMessages = (): Record<string, MessageDescriptor> =>
  defineMessages({
    FREE_BOARD_LIMIT_REACHED: {
      id: 'error handling.board.FREE_BOARD_LIMIT_REACHED',
      defaultMessage: 'Free teams can only have 10 boards.',
      description: 'Error message when free team board limit is reached',
    },
  });

/**
 * Gets error messages specific to enterprise-related errors.
 * @returns A record containing enterprise error message descriptors.
 */
const getEnterpriseErrorMessages = (): Record<string, MessageDescriptor> =>
  defineMessages({
    ORGANIZATION_JOIN_HANDLER_BULK_JOIN_DISABLED: {
      id: 'error handling.enterprise.ORGANIZATION_JOIN_HANDLER_BULK_JOIN_DISABLED',
      defaultMessage:
        "Currently, this feature isn't available for your enterprise.",
      description:
        'Error message when bulk join feature is disabled for enterprise',
    },
    ORGANIZATION_JOIN_HANDLER_NO_ORGANIZATIONS: {
      id: 'error handling.enterprise.ORGANIZATION_JOIN_HANDLER_NO_ORGANIZATIONS',
      defaultMessage: 'Select at least one workspace.',
      description:
        'Error message when no workspaces are selected for enterprise join',
    },
    ORGANIZATION_JOIN_HANDLER_TOO_MANY_ORGANIZATIONS: {
      id: 'error handling.enterprise.ORGANIZATION_JOIN_HANDLER_TOO_MANY_ORGANIZATIONS',
      defaultMessage:
        'You can only select up to 25 workspaces. Unselect a workspace, then try again.',
      description:
        'Error message when too many workspaces are selected for enterprise join',
    },
    ORGANIZATION_JOIN_HANDLER_INELIGIBLE_ORGANIZATION: {
      id: 'error handling.enterprise.ORGANIZATION_JOIN_HANDLER_INELIGIBLE_ORGANIZATION',
      defaultMessage:
        "One of the workspaces isn't eligible to join your enterprise.",
      description:
        'Error message when workspace is not eligible to join enterprise',
    },
    ORGANIZATION_JOIN_HANDLER_NOT_ALLOWED: {
      id: 'error handling.enterprise.ORGANIZATION_JOIN_HANDLER_NOT_ALLOWED',
      defaultMessage:
        'You are not allowed to join workspaces to this enterprise.',
      description:
        'Error message when user is not allowed to join workspaces to enterprise',
    },
    ORGANIZATION_JOIN_HANDLER_NOT_ENOUGH_LICENSES: {
      id: 'error handling.enterprise.ORGANIZATION_JOIN_HANDLER_NOT_ENOUGH_LICENSES',
      defaultMessage:
        'Not enough licenses to join these workspaces to your enterprise. Buy more licenses, then try again.',
      description:
        'Error message when not enough licenses to join workspaces to enterprise',
    },
    ORGANIZATION_JOIN_HANDLER_MAX_ORGANIZATIONS_REACHED: {
      id: 'error handling.enterprise.ORGANIZATION_JOIN_HANDLER_MAX_ORGANIZATIONS_REACHED',
      defaultMessage: 'Cannot join the specified workspaces to the enterprise',
      description:
        'Error message when maximum organizations limit is reached for enterprise',
    },
    ENTERPRISE_ORGANIZATIONS_ORG_CCP_BILLED: {
      id: 'error handling.enterprise.ENTERPRISE_ORGANIZATIONS_ORG_CCP_BILLED',
      defaultMessage:
        'Organization is billed through cloud commerce platform, so it cannot be added to enterprise',
      description:
        'Error message when organization cannot be added to enterprise due to CCP billing',
    },
    UNKNOWN_ERROR: {
      id: 'error handling.enterprise.UNKNOWN_ERROR',
      defaultMessage: 'Unknown error occurred.',
      description:
        'Error message when an unknown error occurs in enterprise context',
    },
  });

/**
 * Gets the appropriate error messages record based on the model type.
 * @param model - The model type to get error messages for.
 * @returns A record containing error message descriptors for the specified model.
 */
const getErrorMessagesByModel = (
  model: ErrorModel,
): Record<string, MessageDescriptor> => {
  switch (model) {
    case 'organization':
      return getOrganizationErrorMessages();
    case 'paidAccount':
      return getPaidAccountErrorMessages();
    case 'promotion':
      return getPromotionErrorMessages();
    case 'promoCode':
      return getPromoCodeErrorMessages();
    case 'board':
      return getBoardErrorMessages();
    case 'enterprise':
      return getEnterpriseErrorMessages();
    default:
      return getDefaultErrorMessages();
  }
};

/**
 * Localizes error codes by model and code, returning a message descriptor.
 *
 * This function takes a model type and error code, then returns a message descriptor
 * that can be used with intl.formatMessage(). If no specific error message is found for the given
 * model and code combination, it returns a default "Unknown error occurred" message descriptor.
 *
 * @param model - The model type (e.g., 'organization', 'paidAccount', 'enterprise', etc.)
 * @param code - The specific error code within that model
 * @returns A message descriptor that can be used with intl.formatMessage()
 *
 * @example
 * ```typescript
 * const errorMessage = localizeErrorCode('organization', 'ORG_NAME_TAKEN');
 * // Returns: { id: 'error handling.organization.ORG_NAME_TAKEN', defaultMessage: 'Short name is taken.' }
 *
 * const unknownError = localizeErrorCode('unknown', 'SOME_CODE');
 * // Returns: { id: 'error handling.enterprise.UNKNOWN_ERROR', defaultMessage: 'Unknown error occurred.' }
 *
 * can be called in this way
 * intl.formatMessage(localizeErrorCode('enterprise', error.code as ErrorCode))
 * ```
 */
export function localizeErrorCode(
  model: ErrorModel,
  code: ErrorCode,
): MessageDescriptor {
  const errorMessages = getErrorMessagesByModel(model);
  const message = errorMessages[code];

  if (message) {
    return message;
  }

  // Return default error if no specific message found
  const defaultErrorMessages = getDefaultErrorMessages();
  return defaultErrorMessages.UNKNOWN_ERROR;
}
