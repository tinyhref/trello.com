import { enterpriseProducts } from './products/enterprise';
import type { ProductId } from './products/ids';
import { organizationProducts } from './products/organization';
import type { Product, ProductDesc } from './types';
import { ProductFamily } from './types';

class FeatureSet {
  private products: Map<ProductId, Product> = new Map();

  constructor(products: Product[]) {
    for (const product of products) {
      this.products.set(product.id, product);
    }
  }

  /**
   * Find the product by product number or by shortName. Used
   * by all methods below to find a given product. Has guards
   * in place for stringified product numbers and for finding
   * the product by name instead of number for legacy support
   *
   * @param desc - product number or short name
   */
  private findProduct(desc?: ProductDesc): Product | undefined {
    if (!desc) {
      return undefined;
    }

    if (typeof desc === 'number') {
      return this.products.get(desc as ProductId);
    }

    if (typeof desc === 'string' && /^\d+$/.test(desc)) {
      return this.products.get(parseInt(desc, 10) as ProductId);
    }

    return [...this.products.values()].find((p) => p.shortName === desc);
  }

  /**
   * This is to be replaced with `Entitlements.isPremium(offering)`
   * checks wherever possible. It should only remain in places specific
   * to shop billing until we can migrate to CCP.
   *
   * @deprecated
   */
  isPremiumProduct = (desc?: ProductDesc) => {
    return this.findProduct(desc)?.family === ProductFamily.Premium;
  };

  /**
   * This is to be replaced with `Entitlements.isStandard(offering)`
   * checks wherever possible. It should only remain in places specific
   * to shop billing until we can migrate to CCP.
   *
   * @deprecated
   */
  isStandardProduct = (desc?: ProductDesc) => {
    return this.findProduct(desc)?.family === ProductFamily.Standard;
  };

  /**
   * The following methods are explicitly for the purpose of legacy
   * shop SKUs. They will have no CCP equivalent and are only here
   * to support UX for shop products that are not in CCP until we can
   * migrate off of them.
   */

  /*
   * This is only used in the status banners at the top of the
   * shop billing page
   */
  getProductName(desc?: ProductDesc) {
    return this.findProduct(desc)?.name;
  }

  /**
   * This is only used for shop Plan comparison and selection
   *
   * @deprecated
   */
  isMonthly(desc?: ProductDesc) {
    return this.findProduct(desc)?.interval === 'monthly';
  }

  /**
   * This is only used for shop Plan comparison and selection
   *
   * @deprecated
   */
  isYearly(desc?: ProductDesc) {
    return this.findProduct(desc)?.interval === 'yearly';
  }

  /**
   * This is only used for shop monthly -> annual upgrade
   *
   * @deprecated
   */
  getYearlyEquivalent(desc?: ProductDesc) {
    return this.findProduct(desc)?.yearlyEquivalent;
  }

  /**
   * This is only used for shop Standard -> Premium upgrade
   *
   * @deprecated
   */
  getBCUpgradeProduct(desc?: ProductDesc) {
    return this.findProduct(desc)?.bcUpgradeProduct;
  }
}

/**
 * This module is deprecated. It should only be used by shop billing
 * views/logic until all billing is migrated to CCP. For determining
 * what products are enabled, use the `Entitlements` package. For
 * feature negotiation use the `premiumFeatures` array on a workspace
 *
 * @deprecated
 */
export const ProductFeatures = new FeatureSet(
  organizationProducts.concat(enterpriseProducts),
);
