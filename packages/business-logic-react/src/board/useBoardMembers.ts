import { useEffect, useMemo, useRef } from 'react';

import { client } from '@trello/graphql';

import {
  useBoardMembersFragment,
  type BoardMembersFragment,
} from './BoardMembersFragment.generated';
import { PatchMemberDataDocument } from './PatchMemberDataQuery.generated';
import { useBoardMembersSharedBusinessLogic } from './useBoardMembersSharedBusinessLogic';

export type Member = BoardMembersFragment['members'][number];

type MissingFields = {
  members?: Record<string, string>;
  [key: string]: unknown;
};

export const getMembersMissingFragmentFields = (
  complete: boolean,
  missing: MissingFields | undefined,
  members: Member[],
  previousMissing: MissingFields | null,
): string[] => {
  if (
    complete ||
    !missing?.members ||
    !members.length ||
    previousMissing === missing
  ) {
    return [];
  }

  const memberIndices = Object.keys(missing.members);
  return memberIndices
    .map((index) => members[Number(index)].id)
    .filter(Boolean) as string[];
};

/**
 * Hook that provides a list of board members and memberships, as well
 * as utility functions for determining if a given user is a member of the board,
 * admin of the board, admin of the workspace, etc.
 *
 * This hook is used in a single board context. Therefore, it uses a fragment
 * to get board data (with some documented patching below), which it passes to
 * useBoardMembersSharedBusinessLogic.
 *
 * NOTE: This hook is _extremely_ expensive, and should be used sparingly.
 * In most cases, within the context of a board view, you can use
 * `BoardMembersContext` (if it doesn't expose everything you need, add it
 * as needed). For this reason, this hook is marked @deprecated.
 *
 * For more context, see https://hello.atlassian.net/wiki/spaces/TRELLOFE/blog/2023/07/10/2652082374/Cutting+BoardFacepile+render+time+in+half
 */
export const useBoardMembers = (idBoard: string) => {
  const {
    data: board,
    complete,
    missing,
  } = useBoardMembersFragment({
    from: {
      id: idBoard,
    },
    optimistic: true,
    returnPartialData: true,
  });
  const members = useMemo(() => board?.members ?? [], [board?.members]);

  /* 🛑 This patches incomplete fragment data in a non-standard way. This should not
   * be repeated as a pattern.
   *
   * In general, the web app quickloads data and later keeps it in sync with socket
   * updates. The useFragment hook provides a lightweight live binding so components
   * can render up-to-date data without making network requests.
   *
   * But what if the incoming socket updates don't contain all fields selected in the fragment?
   * For example, a member gets added to the board, but the socket update does not contain all
   * BoardMembersFragment fields? By default, the fragment becomes incomplete and returns undefined.
   *
   * Setting returnPartialData to true gets the rest of the fragment to return,
   * but it's still missing data (in our case, a few fields on the newly added member).
   * So here, we check if any members are incomplete, specifically looking for fields we
   * know aren't included in socket updates. Then, we kick off a query for that member
   * (making sure we don't make duplicate requests during re-renders) to fetch the missing
   * fields. Apollo writes to the cache, normalizes the data, and the fragment becomes
   * complete again.
   *
   * Previously, we just had a useBoardMembersQuery handle the refetching. But this query
   * caused poor performance in the browser and would refetch the *entire* query if just
   * one member was missing fields.
   */
  const previousMissing = useRef<MissingFields | null>(null);
  const membersMissingFragmentFields = getMembersMissingFragmentFields(
    complete,
    missing as MissingFields | undefined,
    members,
    previousMissing.current,
  );
  previousMissing.current = missing as MissingFields | null;

  const pendingQueries = useRef(new Set<string>());
  useEffect(() => {
    if (membersMissingFragmentFields.length === 0) {
      return;
    }

    membersMissingFragmentFields.forEach((memberId) => {
      if (pendingQueries.current.has(memberId)) {
        return;
      }

      pendingQueries.current.add(memberId);

      // 🛑 See the above comment where membersMissingFragmentFields is declared
      client
        .query({
          query: PatchMemberDataDocument,
          variables: { memberId },
          context: {
            operationName: 'PatchMemberData',
          },
        })
        .finally(() => {
          pendingQueries.current.delete(memberId);
        });
    });
  }, [membersMissingFragmentFields]);

  const boardMembersSharedBusinessLogic = useBoardMembersSharedBusinessLogic({
    board,
    idBoard,
  });

  return {
    ...boardMembersSharedBusinessLogic,
    loading: !complete,
  };
};
