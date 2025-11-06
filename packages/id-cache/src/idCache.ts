import { checkAri } from './checkAri';
import { checkId } from './checkId';
import { isShortLink } from './isShortLink';

type IdCacheKeyType = 'Board' | 'Card' | 'Member' | 'Workspace';
type IdCacheValueType = 'ari' | 'id';
type IdCacheRecord = Record<string, string>;
type IdMap = Record<IdCacheKeyType, IdCacheRecord>;
type Validator = {
  isValid: (input: string) => boolean;
  getErrorMsg: (input: string, typeName?: IdCacheKeyType) => string;
};

/**
 * Validators for different types of keys in the cache.
 */
const keyValidators: Record<IdCacheKeyType, Validator> = {
  Card: {
    isValid: isShortLink,
    getErrorMsg: (key: string) => `Invalid card shortLink: ${key}`,
  },
  Board: {
    isValid: isShortLink,
    getErrorMsg: (key: string) => `Invalid board shortLink: ${key}`,
  },
  Member: {
    isValid: (key: string) => true,
    getErrorMsg: (key: string) => `Invalid member username: ${key}`,
  },
  Workspace: {
    isValid: (key: string) => true,
    getErrorMsg: (key: string) => `Invalid workspace name: ${key}`,
  },
};

/**
 * Validators for different types of values in the cache.
 */
const valueValidators: Record<IdCacheValueType, Validator> = {
  ari: {
    isValid: checkAri,
    getErrorMsg: (value: string, typeName?: IdCacheKeyType) =>
      `Invalid ${typeName} ARI: ${value}`,
  },
  id: {
    isValid: checkId,
    getErrorMsg: (value: string, typeName?: IdCacheKeyType) =>
      `Invalid ${typeName} id: ${value}`,
  },
};

const getEmptyMap: () => IdMap = () => ({
  Card: {},
  Board: {},
  Member: {},
  Workspace: {},
});

class IdCache {
  private idMap: IdMap = getEmptyMap();
  private ariMap: IdMap = getEmptyMap();

  /**
   * Clears the cache.
   * For testing purposes only.
   */
  reset() {
    this.idMap = getEmptyMap();
    this.ariMap = getEmptyMap();
  }

  /**
   * Retrieves the id for the given key.
   * @param typeName The type of model to retrieve the id for.
   * @param key The key to retrieve the id for. (shortlink for cards and boards, name for workspaces)
   * @returns The id for the given key, or undefined if the key is invalid or not found.
   */
  private getId(typeName: IdCacheKeyType, key: string): string | undefined {
    if (!keyValidators[typeName].isValid(key)) {
      return undefined;
    }
    return this.idMap[typeName][key];
  }

  /**
   * Sets the id for the given key.
   * @param typeName The type of model to set the id for.
   * @param key The key to set the id for. (shortlink for cards and boards, name for workspaces)
   * @param id The id to set for the given key.
   * @throws If the id is invalid or the key is invalid.
   */
  private setId(typeName: IdCacheKeyType, key: string, id: string) {
    if (!valueValidators['id'].isValid(id)) {
      throw new Error(valueValidators['id'].getErrorMsg(id, typeName));
    }
    if (!keyValidators[typeName].isValid(key)) {
      throw new Error(keyValidators[typeName].getErrorMsg(key));
    }
    this.idMap[typeName][key] = id;
  }

  /**
   * Retrieves the ARI for the given key.
   * @param typeName The type of model to retrieve the ARI for.
   * @param key The key to retrieve the ARI for. (shortlink for cards and boards, name for workspaces)
   * @returns The ARI for the given key, or undefined if the key is invalid or not found.
   */
  private getAri(typeName: IdCacheKeyType, key: string): string | undefined {
    if (!keyValidators[typeName].isValid(key)) {
      return undefined;
    }
    return this.ariMap[typeName][key];
  }

  /**
   * Sets the ARI for the given key.
   * @param typeName The type of model to set the ARI for.
   * @param key The key to set the ARI for. (shortlink for cards and boards, name for workspaces)
   * @param ari The ARI to set for the given key.
   * @throws If the ARI is invalid or the key is invalid.
   */
  private setAri(typeName: IdCacheKeyType, key: string, ari: string) {
    if (!valueValidators['ari'].isValid(ari)) {
      throw new Error(valueValidators['ari'].getErrorMsg(ari, typeName));
    }
    if (!keyValidators[typeName].isValid(key)) {
      throw new Error(keyValidators[typeName].getErrorMsg(key));
    }
    this.ariMap[typeName][key] = ari;
  }

  /**
   * Adds card id to the cache.
   * @param shortLink Card shortLink
   * @param id Card id
   * @throws If the id is invalid or shortLink is not a real shortLink.
   */
  setCardId(shortLink: string, id: string) {
    return this.setId('Card', shortLink, id);
  }

  /**
   * Adds board id to the cache.
   * @param shortLink Board shortLink
   * @param id Board id
   * @throws If the id is invalid or shortLink is not a real shortLink.
   */
  setBoardId(shortLink: string, id: string) {
    return this.setId('Board', shortLink, id);
  }

  /**
   * Adds member id to the cache.
   * @param username Member username
   * @param id Member id
   * @throws If the id is invalid.
   */
  setMemberId(username: string, id: string) {
    return this.setId('Member', username, id);
  }

  /**
   * Adds workspace id to the cache.
   * @param name Workspace name
   * @param id Workspace id
   * @throws If the id is invalid.
   */
  setWorkspaceId(name: string, id: string) {
    return this.setId('Workspace', name, id);
  }

  /**
   * Retrieves card id by shortLink.
   * @param shortLink Card shortLink
   * @returns Card id or undefined if not found or shortLink is invalid.
   */
  getCardId(shortLink: string) {
    return this.getId('Card', shortLink);
  }

  /**
   * Retrieves board id by shortLink.
   * @param shortLink Board shortLink
   * @returns Board id or undefined if not found or shortLink is invalid.
   */
  getBoardId(shortLink: string) {
    return this.getId('Board', shortLink);
  }

  /**
   * Retrieves member id by username.
   * @param name Member name
   * @returns Member id or undefined if not found.
   */
  getMemberId(name: string) {
    return this.getId('Member', name);
  }

  /**
   * Retrieves workspace id by name.
   * @param name Workspace name
   * @returns Workspace id or undefined if not found.
   */
  getWorkspaceId(name: string) {
    return this.getId('Workspace', name);
  }

  /**
   * Adds card ARI to the cache.
   * @param shortLink Card shortLink
   * @param ari Card ARI
   * @throws If the ARI is invalid or shortLink is not a real shortLink.
   */
  setCardAri(shortLink: string, ari: string) {
    return this.setAri('Card', shortLink, ari);
  }

  /**
   * Adds board ARI to the cache.
   * @param shortLink Board shortLink
   * @param ari Board ARI
   * @throws If the ARI is invalid or shortLink is not a real shortLink.
   */
  setBoardAri(shortLink: string, ari: string) {
    return this.setAri('Board', shortLink, ari);
  }

  /**
   * Adds member ARI to the cache.
   * @param name Member name
   * @param ari Member ARI
   * @throws If the ARI is invalid.
   */
  setMemberAri(name: string, ari: string) {
    return this.setAri('Member', name, ari);
  }

  /**
   * Adds workspace ARI to the cache.
   * @param name Workspace name
   * @param ari Workspace ARI
   * @throws If the ARI is invalid.
   */
  setWorkspaceAri(name: string, ari: string) {
    return this.setAri('Workspace', name, ari);
  }

  /**
   * Retrieves card ARI by shortLink.
   * @param shortLink Card shortLink
   * @returns Card ARI or undefined if not found or shortLink is invalid.
   */
  getCardAri(shortLink: string) {
    return this.getAri('Card', shortLink);
  }

  /**
   * Retrieves board ARI by shortLink.
   * @param shortLink Board shortLink
   * @returns Board ARI or undefined if not found or shortLink is invalid.
   */
  getBoardAri(shortLink: string) {
    return this.getAri('Board', shortLink);
  }

  /**
   * Retrieves member ARI by name.
   * @param name Member name
   * @returns Member ARI or undefined if not found.
   */
  getMemberAri(name: string) {
    return this.getAri('Member', name);
  }

  /**
   * Retrieves workspace ARI by name.
   * @param name Workspace name
   * @returns Workspace ARI or undefined if not found.
   */
  getWorkspaceAri(name: string) {
    return this.getAri('Workspace', name);
  }

  // This is temporary solution to make id conversions for early adoption of the native GraphQL
  #reverse(map: { [key: string]: string }): { [key: string]: string } {
    return Object.keys(map).reduce<{ [key: string]: string }>((ret, key) => {
      ret[map[key]] = key;
      return ret;
    }, {});
  }

  /**
   * 🚧 DO NOT USE 🚧
   * This is a temporary hack!
   * Retrieves shortLink by board id for native quickload request.
   *
   * @param id object Id of the legacy client-side/Backbone Board
   * @returns board shortLink
   */
  __getBoardShortLinkById__DO_NOT_USE(id: string) {
    if (!checkId(id)) {
      return undefined;
    }
    const reverseBoardMap = this.#reverse(this.idMap['Board']);
    return reverseBoardMap[id];
  }
}

export const idCache = new IdCache();
