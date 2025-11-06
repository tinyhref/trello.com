import { v4 as uuidv4 } from 'uuid';

let sessionId: string;

export const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = uuidv4();
  }

  return sessionId;
};
