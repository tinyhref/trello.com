class Entitlement {
  isFree(offering?: string | null): boolean {
    return offering === 'trello.free' || offering === 'trello.personal_free';
  }

  isStandard(offering?: string | null): boolean {
    return (
      offering === 'trello.standard' || offering === 'trello.personal_standard'
    );
  }

  isPremium(offering?: string | null): boolean {
    return (
      offering === 'trello.business_class' ||
      offering === 'trello.premium_po' ||
      offering === 'trello.premium' ||
      offering === 'trello.personal_premium'
    );
  }

  isEnterprise(offering?: string | null): boolean {
    return (
      offering === 'trello.enterprise' ||
      offering === 'trello.enterprise_without_sso'
    );
  }
}

export const Entitlements = new Entitlement();
