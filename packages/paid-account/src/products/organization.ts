import type { Product } from '../types';
import {
  ProductFamily,
  ProductInterval,
  ProductName,
  ProductShortName,
} from '../types';
import { Products } from './ids';

export const organizationProducts: Product[] = [
  {
    id: Products.Organization.Premium.v3_3.monthly,
    shortName: ProductShortName.Premium,
    name: ProductName.Premium,
    interval: ProductInterval.Monthly,
    family: ProductFamily.Premium,
    prebill: true,
    perUser: true,
    current: true,
    yearlyEquivalent: Products.Organization.Premium.v3_3.yearly,
  },
  {
    id: Products.Organization.Premium.v3_3.yearly,
    shortName: ProductShortName.Premium,
    name: ProductName.Premium,
    interval: ProductInterval.Yearly,
    family: ProductFamily.Premium,
    prebill: true,
    perUser: true,
    current: true,
  },
  {
    id: Products.Organization.Standard.v1.yearly,
    shortName: ProductShortName.StandardYearly,
    name: ProductName.Standard,
    interval: ProductInterval.Yearly,
    family: ProductFamily.Standard,
    prebill: true,
    perUser: true,
    current: true,
    bcUpgradeProduct: Products.Organization.Premium.v3_3.yearly,
  },
  {
    id: Products.Organization.Standard.v1.monthly,
    shortName: ProductShortName.StandardMonthly2,
    name: ProductName.Standard,
    interval: ProductInterval.Monthly,
    family: ProductFamily.Standard,
    prebill: true,
    perUser: true,
    current: true,
    yearlyEquivalent: Products.Organization.Standard.v1.yearly,
    bcUpgradeProduct: Products.Organization.Premium.v3_3.monthly,
  },
];
