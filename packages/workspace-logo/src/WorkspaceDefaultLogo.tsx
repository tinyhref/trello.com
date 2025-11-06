import classnames from 'classnames';

import * as styles from './WorkspaceDefaultLogo.module.less';

export type Gradients = 'blue' | 'green' | 'orange' | 'pink' | 'teal';

/**
 * This function takes an input of text and converts it to a number using
 * the sum of charCodes for each character in the string. That sum is then
 * divided by the number of pre-set gradients and the remainder value is
 * used to select which gradient to use. Which specific gradient ends up
 * being chosen is not relevant for design. The goal is to have a variety
 * of selected colors for the logos of each workspace and to have that
 * selection be stable and persist between renders/reloads.
 *
 * @param text - A string used to select the gradient
 * @returns a pseudo-randomly selected gradient name
 */
export const getRandomGradient = (text: string) => {
  const gradients: Gradients[] = ['teal', 'green', 'blue', 'pink', 'orange'];

  const sum = text.split('').reduce((acc, val) => {
    return acc + val.charCodeAt(0);
  }, 0);

  const g = sum % gradients.length;

  return gradients[g];
};

type Size = 'medium' | 'small' | 'xsmall' | 'xxsmall';

export const WorkspaceDefaultLogo = ({
  name,
  className,
  size,
  desaturate = false,
}: {
  name: string;
  className?: string;
  desaturate?: boolean;
  size?: Size;
}) => {
  const initial = name.substr(0, 1).toUpperCase();
  const gradient = getRandomGradient(name);
  const tileColorClassName = desaturate
    ? `desaturateLogo`
    : `defaultLogoGradient-${gradient}`;

  return (
    <div
      className={classnames(
        styles.defaultLogoContainer,
        styles[tileColorClassName],
        className,
        {
          [styles.xxsmall]: size === 'xxsmall',
          [styles.xsmall]: size === 'xsmall',
        },
      )}
    >
      {initial}
    </div>
  );
};
