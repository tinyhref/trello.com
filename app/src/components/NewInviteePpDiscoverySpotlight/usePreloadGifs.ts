import { useEffect } from 'react';

import InboxImage from './Inbox.gif';
import PlannerImage from './Planner.gif';

export const usePreloadGifs = () => {
  useEffect(() => {
    [InboxImage, PlannerImage].forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []);
};
