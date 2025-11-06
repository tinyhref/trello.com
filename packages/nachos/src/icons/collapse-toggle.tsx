import type { FunctionComponent } from 'react';

import { Icon } from '../components/Icon';
import type { GlyphProps } from '../components/Icon/Icon.types';

const CollapseToggleIconGlyph = () => {
  return (
    <svg
      width="16"
      height="6"
      viewBox="0 0 16 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 0C1.17157 0 0.5 0.67155 0.5 1.5V4.5C0.5 5.32845 1.17157 6 2 6H14C14.8285 6 15.5 5.32845 15.5 4.5V1.5C15.5 0.67155 14.8285 0 14 0H2ZM2 2.25C2 1.83578 2.33579 1.5 2.75 1.5H4.25C4.66423 1.5 5 1.83578 5 2.25V3.75C5 4.16423 4.66423 4.5 4.25 4.5H2.75C2.33579 4.5 2 4.16423 2 3.75V2.25ZM5.75 3C5.75 2.79292 5.91792 2.625 6.125 2.625H13.625C13.8321 2.625 14 2.79292 14 3C14 3.20708 13.8321 3.375 13.625 3.375H6.125C5.91792 3.375 5.75 3.20708 5.75 3Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const CollapseToggleIcon: FunctionComponent<GlyphProps> = (props) => {
  const { testId, dangerous_className, size, color, label, block } = props;
  return (
    <Icon
      testId={testId || 'CollapseToggleIcon'}
      size={size}
      dangerous_className={dangerous_className}
      color={color}
      block={block}
      label={label}
      glyph={CollapseToggleIconGlyph}
    />
  );
};
