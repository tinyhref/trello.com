import { sequenceNumberState } from '../../sequenceNumberState';

/**
 * Simple circuit breaker to ensure we don't get stuck in
 * a reconnection loop by replaying messages that may immediately
 * close the socket and cause us to try and replay again.
 */
export class ReplayCircuitBreaker {
  private readonly windowMs: number;
  private readonly maxReplayPerWindow: number;
  private readonly circuitOpenMs: number;
  private isCircuitOpen: boolean;
  private replayAttempts: Array<{ timestamp: number; key: string }>;

  constructor(
    windowMs: number = 60_000,
    maxReplayPerWindow: number = 10,
    circuitOpenMs: number = 30_000,
  ) {
    this.windowMs = windowMs;
    this.maxReplayPerWindow = maxReplayPerWindow;
    this.circuitOpenMs = circuitOpenMs;
    this.isCircuitOpen = false;
    this.replayAttempts = [];
  }

  canReplay(key: string): boolean {
    if (this.isCircuitOpen) {
      return false;
    }

    this.cleanupPreviousAttempts();
    const recentAttempts = this.replayAttempts.filter(
      (attempt) => attempt.key === key,
    );

    return recentAttempts.length < this.maxReplayPerWindow;
  }

  recordReplayAttempt(key: string) {
    this.replayAttempts.push({ timestamp: Date.now(), key });
    if (!this.canReplay(key)) {
      this.openCircuit();
    }
  }

  private openCircuit() {
    this.isCircuitOpen = true;

    // Reset the sequence number for the given key
    sequenceNumberState.reset();
    setTimeout(() => {
      this.isCircuitOpen = false;
      this.replayAttempts = [];
    }, this.circuitOpenMs);
  }

  private cleanupPreviousAttempts() {
    const cutoffTime = Date.now() - this.windowMs;
    this.replayAttempts = this.replayAttempts.filter(
      (attempt) => attempt.timestamp > cutoffTime,
    );
  }
}

export const replayCircuitBreaker = new ReplayCircuitBreaker();
