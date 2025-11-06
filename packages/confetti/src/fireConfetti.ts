import confetti from 'canvas-confetti';
import { random } from 'underscore';

interface ConfettiOptions {
  x: number;
  y: number;
  angle?: number;
  spread?: number;
  particleCount?: number;
}

export const fireConfetti = ({
  x,
  y,
  angle,
  spread,
  particleCount,
}: ConfettiOptions) => {
  confetti({
    angle: angle ?? random(55, 125),
    spread: spread ?? random(50, 70),
    particleCount: particleCount ?? random(40, 75),
    origin: {
      x,
      y,
    },
    disableForReducedMotion: true,
  });
};

export const resetConfetti = confetti.reset;
