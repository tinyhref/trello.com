import { ModelCache } from 'app/scripts/db/ModelCache';
import type { Board as LegacyBoardModel } from 'app/scripts/models/Board';
import type { Card as LegacyCardModel } from 'app/scripts/models/Card';
import type { Label } from 'app/scripts/models/Label';
import type { List } from 'app/scripts/models/List';
import type { Member } from 'app/scripts/models/Member';
import { NoopError } from './NoopError';

export function getCached(type: 'Card', id: string): LegacyCardModel;
export function getCached(type: 'Board', id: string): LegacyBoardModel;
export function getCached(type: 'Label', id: string): Label;
export function getCached(type: 'List', id: string): List;
export function getCached(type: 'Member', id: string): Member;
export function getCached(
  type: 'Board' | 'Card' | 'Label' | 'List' | 'Member',
  id: string,
): Label | LegacyBoardModel | LegacyCardModel | List | Member {
  // @ts-expect-error
  const cached = ModelCache.get(type, id);
  if (!cached) {
    // If model is not in cache, that's fine; a user could be trying to undo or
    // redo an action from long ago that is no longer referenceable in cache.
    throw new NoopError();
  }
  return cached;
}
