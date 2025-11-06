import type { ClientCode, ClientCodeValue } from './SocketConnection.types';

/**
 * Closes a WebSocket connection from the client-side. Usually the WebSocket onclose handler would await a response from
 * the server, but when calling this function the onclose function is invoked immediately with a CloseEvent reflecting
 * the client-side closure.
 *
 * @param ws The WebSocket connection that should be closed.
 * @param code The close code that will be sent to the server (if it is still listening).
 * @param reason A friendly string explaining the reason for the closure.
 */
export function closeWithCode(
  ws: WebSocket | null,
  code: typeof ClientCode.ConnectionAcknowledgementError,
  reason: 'Connection Acknowledgement Error',
): void;
export function closeWithCode(
  ws: WebSocket | null,
  code: typeof ClientCode.ConnectionAcknowledgementTimeout,
  reason: 'Connection Acknowledgement Timeout',
): void;
export function closeWithCode(
  ws: WebSocket | null,
  code: typeof ClientCode.ErrorSendingMessage,
  reason: 'Error Sending Message',
): void;
export function closeWithCode(
  ws: WebSocket | null,
  code: typeof ClientCode.InternetUnhealthy,
  reason: 'Internet Unhealthy',
): void;
export function closeWithCode(
  ws: WebSocket | null,
  code: typeof ClientCode.PingTimeout,
  reason: 'Ping Timeout',
): void;
export function closeWithCode(
  ws: WebSocket | null,
  code: typeof ClientCode.SubscriptionError,
  reason: 'Subscription Error',
): void;
export function closeWithCode(
  ws: WebSocket | null,
  code: typeof ClientCode.MessageTimeout,
  reason: 'Message Timeout',
): void;
export function closeWithCode(
  ws: WebSocket | null,
  code: typeof ClientCode.ResyncError,
  reason: 'Resync Error',
): void;
export function closeWithCode(
  ws: WebSocket | null,
  code: ClientCodeValue,
  reason: string,
) {
  if (!ws) {
    return;
  }

  const closeEvent = new CloseEvent('close', {
    code,
    reason,
    wasClean: false,
  });

  ws.close(code, reason);
  ws.onclose?.(closeEvent);
}
