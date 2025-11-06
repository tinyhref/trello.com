import type { TrelloWindow } from '@trello/window-types';

interface StarredBoard {
  id: string;
  name: string;
  url: string;
  pos: number;
  prefs: {
    backgroundImage: string;
    backgroundColor: string;
  };
}

type StarredBoardsPayload = StarredBoard[];

interface UrlsPayload {
  boardsPage?: string;
  myCardsPage?: string;
}

interface ThemePayload {
  colorMode: 'auto' | 'dark' | 'light' | null;
  effectiveColorMode: 'dark' | 'light' | null;
}

type Unsubscribe = () => void;

interface InvokeChannel {
  prompt: (message: string, defaultValue: string) => string;
}

type OnChannel = object;

interface SendChannel {
  'starred-boards': (boards: StarredBoardsPayload) => void;
  urls: (urls: UrlsPayload) => void;
  theme: (theme: ThemePayload) => void;
  'set-notification-count': (count: number) => void;
}

type SendSyncChannel = object;

interface DesktopIpc {
  isChannelSupported<
    TChannel extends keyof (InvokeChannel &
      OnChannel &
      SendChannel &
      SendSyncChannel),
  >(
    channel: TChannel,
  ): boolean;
  invoke<TChannel extends keyof InvokeChannel>(
    channel: TChannel,
    ...args: Parameters<InvokeChannel[TChannel]>
  ): Promise<ReturnType<InvokeChannel[TChannel]>>;
  on<TChannel extends keyof OnChannel>(
    channel: TChannel,
    listener: OnChannel[TChannel],
  ): Unsubscribe;
  once<TChannel extends keyof OnChannel>(
    channel: TChannel,
    listener: OnChannel[TChannel],
  ): Unsubscribe;
  removeAllListeners<TChannel extends keyof OnChannel>(channel: TChannel): void;
  send<TChannel extends keyof SendChannel>(
    channel: TChannel,
    ...args: Parameters<SendChannel[TChannel]>
  ): void;
  sendSync<TChannel extends keyof SendSyncChannel>(
    channel: TChannel,
    ...args: Parameters<SendSyncChannel[TChannel]>
  ): ReturnType<SendSyncChannel[TChannel]>;
}

declare const window: TrelloWindow;

export const desktopIpc = window?.electron?.ipc as DesktopIpc;
export type { StarredBoard, StarredBoardsPayload };
