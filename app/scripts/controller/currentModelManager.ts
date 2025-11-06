import Hearsay from 'hearsay';

export interface BackboneModel {
  id: string;
  get(attribute: string): string;
  typeName: string;
  getOrganization(): () => object;
}

const VALID_ID_REGEX = /^[a-f0-9]{24}$/;
const isValidObjectID = (s: string | null) =>
  typeof s === 'string' && VALID_ID_REGEX.test(s);

const VALID_SHORT_LINK_REGEX = /^[a-zA-Z0-9]{8}$/;
const isShortLink = (s: string | null) =>
  typeof s === 'string' && VALID_SHORT_LINK_REGEX.test(s);

class CurrentModelManager {
  currentModel: {
    use: () => void;
    get: () => BackboneModel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (model: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribe: (model: any) => void;
  };

  constructor() {
    this.currentModel = new Hearsay.Slot(null);
  }

  onAnyOrganizationView() {
    return this.currentModel.get()?.typeName === 'Organization';
  }

  onOrganizationView(idOrganization: string) {
    return (
      this.onAnyOrganizationView() &&
      this.currentModel.get().id === idOrganization
    );
  }

  onAnyBoardView() {
    return this.currentModel.get()?.typeName === 'Board';
  }

  onAnyEnterpriseView() {
    return this.currentModel.get()?.typeName === 'Enterprise';
  }

  onEnterpriseView(idEnterprise: string) {
    return (
      this.onAnyEnterpriseView() && this.currentModel.get().id === idEnterprise
    );
  }

  getCurrentBoard() {
    if (this.onAnyBoardView()) {
      return this.currentModel.get();
    } else {
      return null;
    }
  }

  onAnyCardView() {
    return this.currentModel.get()
      ? this.currentModel.get().typeName === 'Card'
      : false;
  }

  onBoardView(idBoardOrShortLink: string) {
    if (this.onAnyBoardView()) {
      if (isValidObjectID(idBoardOrShortLink)) {
        return this.currentModel.get().id === idBoardOrShortLink;
      } else if (isShortLink(idBoardOrShortLink)) {
        return this.currentModel.get().get('shortLink') === idBoardOrShortLink;
      }
    } else {
      return false;
    }
  }
}

const currentModelManager = new CurrentModelManager();

// We're a singleton; this should last forever
currentModelManager.currentModel.use();

export { currentModelManager };
