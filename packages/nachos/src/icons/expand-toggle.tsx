import type { FunctionComponent } from 'react';

import { Icon } from '../components/Icon';
import type { GlyphProps } from '../components/Icon/Icon.types';

const ExpandToggleIconGlyph = () => {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 0.75C1.17157 0.75 0.5 1.42157 0.5 2.25V9.75C0.5 10.5785 1.17157 11.25 2 11.25H14C14.8285 11.25 15.5 10.5785 15.5 9.75V2.25C15.5 1.42157 14.8285 0.75 14 0.75H2ZM2 3C2 2.58578 2.33579 2.25 2.75 2.25H4.25C4.66423 2.25 5 2.58578 5 3V4.5C5 4.91423 4.66423 5.25 4.25 5.25H2.75C2.33579 5.25 2 4.91423 2 4.5V3ZM5.75 3.75C5.75 3.54292 5.91792 3.375 6.125 3.375H13.625C13.8321 3.375 14 3.54292 14 3.75C14 3.95708 13.8321 4.125 13.625 4.125H6.125C5.91792 4.125 5.75 3.95708 5.75 3.75ZM2.75 6C2.33579 6 2 6.33577 2 6.75C2 7.16423 2.33579 7.5 2.75 7.5H13.25C13.6642 7.5 14 7.16423 14 6.75C14 6.33577 13.6642 6 13.25 6H2.75ZM2 9C2 8.58577 2.33579 8.25 2.75 8.25H7.25C7.66423 8.25 8 8.58577 8 9C8 9.41422 7.66423 9.75 7.25 9.75H2.75C2.33579 9.75 2 9.41422 2 9Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const ExpandToggleIcon: FunctionComponent<GlyphProps> = (props) => {
  const { testId, dangerous_className, size, color, label, block } = props;
  return (
    <Icon
      testId={testId || 'ExpandToggleIcon'}
      size={size}
      dangerous_className={dangerous_className}
      color={color}
      block={block}
      label={label}
      glyph={ExpandToggleIconGlyph}
    />
  );
};
