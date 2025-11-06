/* eslint-disable @trello/export-matches-filename */

import {
  NetworkError,
  PaidAccountErrorExtensions,
} from '@trello/graphql-error-handling';
import { intl } from '@trello/i18n';
import type { PIIString } from '@trello/privacy';
import {
  dangerouslyConvertPrivacyString,
  EMPTY_PII_STRING,
} from '@trello/privacy';

import { euCountries, usTerritories } from './countries';

const nonEuTaxCountries = [
  'AU',
  'CA',
  'GB',
  'KR',
  'NG',
  'NO',
  'NZ',
  'PH',
  'SG',
  'ID',
  'TZ',
];

/**
 * Checks for postal codes that begin with G, H or J in Canada
 * @see https://en.wikipedia.org/wiki/Postal_codes_in_Canada
 */
export const isQuebec = (country: string, zipCode?: string): boolean => {
  return country === 'CA' && /^[GHJ]/i.test(zipCode || '');
};

/**
 * Check if the country accepts a Tax ID number
 * - EU countries, the UK, Norway, Nigeria, Indonesia and The Republic of Korea accept a VAT number
 * - Australia accepts an ABN number
 * - New Zealand accepts a GST number
 * - Quebec, Canada accepts a QST number
 * - Singapore accepts a GST number
 *
 * Should mimic similar validation logic in shop. See
 * @see https://bitbucket.org/trello/aardvark/src/master/Aardvark/Accounting/CAvalara.cs
 */
export const acceptsTaxId = (country: string): boolean => {
  return euCountries.concat(nonEuTaxCountries).includes(country);
};
/**
 * Checks if a given country accepts a state-level tax id number.
 * Currently only applicable to Quebec, Canada
 */
export const acceptsStateTaxId = (country: string, zipCode?: string): boolean =>
  isQuebec(country, zipCode);

/**
 * Returns the appropriate abbreviation for the type of Tax ID required by
 * the given country / zipCode combination
 */
export const getTaxType = (country: PIIString): '' | 'ABN' | 'GST' | 'VAT' => {
  const dangerouslyConvertedCountry = dangerouslyConvertPrivacyString(country);
  if (!acceptsTaxId(dangerouslyConvertedCountry)) {
    return '';
  }
  if (dangerouslyConvertedCountry === 'AU') {
    return 'ABN';
  } else if (dangerouslyConvertedCountry === 'NZ') {
    return 'GST';
  } else if (dangerouslyConvertedCountry === 'CA') {
    return 'GST';
  } else if (dangerouslyConvertedCountry === 'SG') {
    return 'GST';
  } else {
    return 'VAT';
  }
};

/**
 * Returns the appropriate abbreviation for the type of Tax ID required by
 * the given country / state combination. Currently only used for
 * Quebec, Canada
 */
export const getStateTaxType = (
  country: string,
  zipCode: string = '',
): '' | 'QST' => {
  return isQuebec(country, zipCode) ? 'QST' : '';
};

/**
 * For a country / zip code combination that requires a tax ID number,
 * checks that it is within the valid length range. Does not attempt to
 * validate the taxable entity or do any further pattern matching than
 * just checking the length. Proper validation is done server-side.
 *
 * @see https://bitbucket.org/trello/aardvark/src/master/Aardvark/Accounting/CAvalara.cs
 * @see https://en.wikipedia.org/wiki/VAT_identification_number
 * @see https://www.canada.ca/en/revenue-agency/services/e-services/e-services-businesses/confirming-a-gst-hst-account-number.html
 * @see https://mytax.iras.gov.sg/ESVWeb/default.aspx?target=GSTListingSearch
 */
export const isValidTaxId = (
  taxId: string = '',
  country: PIIString = EMPTY_PII_STRING,
): boolean => {
  const dangerouslyConvertedCountry = dangerouslyConvertPrivacyString(country);
  if (!acceptsTaxId(dangerouslyConvertedCountry)) {
    return true;
  }
  if (taxId?.length) {
    let taxDigitsLength = taxId.replace(/\D/g, '').length;
    let maxLength = 12;
    let minLength = 2;
    if (dangerouslyConvertedCountry === 'CA') {
      maxLength = 14;
    } else if (dangerouslyConvertedCountry === 'SG') {
      // Singapore GST is alphaNumeric
      taxDigitsLength = taxId.replace(/[^a-zA-Z0-9]/g, '').length;
      minLength = 9;
      maxLength = 10;
    } else if (dangerouslyConvertedCountry === 'ID') {
      // Indonesia VAT is 16 digits
      minLength = maxLength = 16;
    } else if (dangerouslyConvertedCountry === 'NG') {
      // Nigeria VAT is 12 digits
      minLength = maxLength = 12;
    }
    return taxDigitsLength >= minLength && taxDigitsLength <= maxLength;
  } else {
    return true;
  }
};

/**
 * Checks if a given country requires a zip code to be entered. These include
 * - United States
 * - US Territories
 * - Canada
 */
export const requiresZipCode = (country: PIIString): boolean => {
  const dangerouslyConvertedCountry = dangerouslyConvertPrivacyString(country);
  return (
    dangerouslyConvertedCountry === 'US' ||
    dangerouslyConvertedCountry === 'CA' ||
    usTerritories.includes(dangerouslyConvertedCountry)
  );
};

/**
 * Validates that the given zip code looks valid
 * - USA format: 5 digits
 *   - Shop does not support 9 digit zip codes
 * - Canadian format: A1A-1A1
 *   - Shop does not validate Canadian zip code formats, it just forwards
 *     them to Avalara. We only check that they're <= 11 characters
 * - All other countries:
 *   - We only check that they are <= 11 characters, Avalara's limit
 */
export const isValidZipCode = (
  zipCode: PIIString,
  country: PIIString,
): boolean => {
  const dangerouslyConvertedZipCode = dangerouslyConvertPrivacyString(zipCode);
  const dangerouslyConvertedCountry = dangerouslyConvertPrivacyString(country);
  if (
    dangerouslyConvertedCountry === 'US' ||
    usTerritories.includes(dangerouslyConvertedCountry)
  ) {
    const ref = dangerouslyConvertedZipCode.replace(/\D/g, '').length;
    return ref === 5;
  } else if (dangerouslyConvertedCountry === 'CA') {
    return zipCode.length > 0 && zipCode.length <= 11;
  } else {
    return zipCode.length <= 11;
  }
};

/**
 * Validate credit card form fields relevant to taxes
 */
export const validateTaxInfo = (
  country: PIIString,
  zipCode: PIIString,
  taxId: string,
): void => {
  if (requiresZipCode(country) && !isValidZipCode(zipCode, country)) {
    throw new NetworkError('invalid zip code', {
      code: PaidAccountErrorExtensions.BILLING_INVALID_ZIP_CODE,
      status: 400,
    });
  }
  if (!isValidTaxId(taxId, country)) {
    throw new NetworkError('invalid tax id', {
      code: PaidAccountErrorExtensions.BILLING_INVALID_TAX_ID,
      status: 400,
    });
  }
};

/**
 * Generate a label for a tax charge based on the country, zip code and tax region
 */
export const taxRegionLabel = (
  tax: number | null,
  country: PIIString | string,
  zipCode: PIIString,
  taxRegion: string | null,
) => {
  if (country === 'CA') {
    return isQuebec(country, dangerouslyConvertPrivacyString(zipCode))
      ? 'CA GST/QST'
      : 'CA GST/HST';
  }
  if (tax && taxRegion === 'IL') {
    return 'Chicago LTT';
  }
  return intl.formatMessage(
    {
      id: 'templates.credit_card.sales-tax',
      defaultMessage: '{region} Sales Tax',
      description: '{region} Sales Tax',
    },
    {
      region: tax ? taxRegion : '',
    },
  );
};

/**
 * Checks if a given country accepts a VAT registration status.
 * Currently only applicable to the Philippines.
 */
export const acceptsVATRegistrationStatus = (countryCode: string): boolean =>
  countryCode === 'PH';
