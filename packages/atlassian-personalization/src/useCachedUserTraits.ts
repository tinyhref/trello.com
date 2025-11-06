import { useEffect } from 'react';

import { getAaId } from '@trello/authentication';
import { sendErrorEvent } from '@trello/error-reporting';
import { useFeatureGate } from '@trello/feature-gate-client';
import { Poller } from '@trello/poller';

import { fetchUserPersonalization } from './fetchUserPersonalization';
import { isValidTraitName } from './traits';
import { userTraitsSharedState } from './userTraitsSharedState';

const BASE_REFRESH_INTERVAL_IN_MS_STG = 60_000; // 60 seconds
const BASE_REFRESH_INTERVAL_IN_MS_PROD = 3_600_000; // 1 hour

let poller: Poller;

const fetchUserTraits = async (aaId: string): Promise<void> => {
  if (!userTraitsSharedState.value[aaId]?.refreshing) {
    const previousTraitAttributes =
      userTraitsSharedState.value[aaId]?.attributes;
    const previousLoading = userTraitsSharedState.value[aaId]?.loading;

    userTraitsSharedState.setValue({
      ...userTraitsSharedState.value,
      [aaId]: {
        attributes: previousTraitAttributes ?? [],
        loading: previousLoading,
        refreshing: true,
      },
    });
    try {
      const { attributes } = await fetchUserPersonalization(aaId);
      if (!attributes) {
        userTraitsSharedState.setValue({
          ...userTraitsSharedState.value,
          [aaId]: {
            attributes: previousTraitAttributes ?? [],
            loading: false,
            refreshing: false,
          },
        });
        return;
      }

      const validAttributes = attributes.filter((attr) =>
        isValidTraitName(attr.name),
      );
      userTraitsSharedState.setValue({
        ...userTraitsSharedState.value,
        [aaId]: {
          attributes: validAttributes,
          loading: false,
          refreshing: false,
        },
      });
    } catch (error) {
      sendErrorEvent(error);
      userTraitsSharedState.setValue({
        ...userTraitsSharedState.value,
        [aaId]: {
          attributes: previousTraitAttributes ?? [],
          loading: false,
          refreshing: false,
        },
      });
      throw error;
    }
  }
};

export const useCachedUserTraits: () => void = () => {
  const userAaId = getAaId();
  const { value: isPollingEnabled } = useFeatureGate('ghost_poll_user_traits');

  useEffect(() => {
    if (!userAaId) {
      return;
    }

    if (!userTraitsSharedState.value[userAaId]) {
      userTraitsSharedState.setValue({
        ...userTraitsSharedState.value,
        [userAaId]: {
          attributes: [],
          loading: true,
          refreshing: false,
        },
      });
    }

    const fetchTraits = async (): Promise<void> => {
      try {
        await fetchUserTraits(userAaId);
      } catch (error) {
        // No-op. Errored handled in fetchUserTraits
      }
    };

    if (!isPollingEnabled) {
      fetchTraits();
    } else {
      if (!poller) {
        poller = new Poller(
          async () => {
            await fetchUserTraits(userAaId);
          },
          {
            staging: BASE_REFRESH_INTERVAL_IN_MS_STG,
            prod: BASE_REFRESH_INTERVAL_IN_MS_PROD,
          },
        );
      }

      if (!poller.isPolling()) {
        poller.start();
      }
    }
  }, [isPollingEnabled, userAaId]);

  useEffect(() => {
    if (poller) {
      if (!isPollingEnabled) {
        poller.stop();
      }
    }
  }, [isPollingEnabled]);
};
