import type { CSSProperties, FunctionComponent } from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { ActionSubjectIdType, SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { token } from '@trello/theme';

import { ArrowRight } from './icons/ArrowRight';
import { getIcon } from './icons/getIcon';
import { useAnalyticsAttributes } from './AnalyticsAttributesProvider';
import { getColorInitial } from './getColorInitial';

import * as styles from './UiNavLink.module.less';

const ICON_COLORS = {
  B: token('color.icon.accent.blue', '#1D7AFC'),
  G: token('color.icon.accent.green', '#22A06B'),
  M: token('color.icon.accent.magenta', '#CD519D'),
  N: token('color.icon.accent.gray', '#758195'),
  R: token('color.icon.accent.red', '#C9372C'),
  T: token('color.icon.accent.teal', '#2898BD'),
  Y: token('color.icon.accent.yellow', '#B38600'),
};

const BACKGROUND_COLORS = {
  B: token('color.background.accent.blue.subtle', '#579DFF'),
  G: token('color.background.accent.green.subtle', '#4BCE97'),
  M: token('color.background.accent.magenta.subtle', '#E774BB'),
  R: token('color.background.accent.red.subtle', '#F87168'),
  T: token('color.background.accent.teal.subtle', '#6CC3E0'),
  Y: token('color.background.accent.yellow.subtle', '#F5CD47'),
};

interface UiNavLinkProps {
  addBackgroundColorOnHover?: boolean;
  titleHeading: string;
  description: string;
  url: string;
  icon?:
    | 'Bolt'
    | 'Box'
    | 'BrowserCode'
    | 'Building'
    | 'ButlerAutomationHead'
    | 'GlobeNetworkLocation'
    | 'Lego'
    | 'Lightbulb'
    | 'Megaphone'
    | 'New'
    | 'Pencil'
    | 'RocketInclined'
    | 'Star'
    | 'TrelloCardTemplates'
    | 'TrelloIntegrations';
  iconColor?: 'Blue' | 'Green' | 'Magenta' | 'Red' | 'Teal' | 'Yellow';
  decorator?: 'Arrow Right';
  tabIndex?: number;
  analyticsLinkName: ActionSubjectIdType;
  analyticsSource: SourceType;
}

export const UiNavLink: FunctionComponent<UiNavLinkProps> = ({
  addBackgroundColorOnHover = true,
  titleHeading,
  description,
  url,
  icon,
  iconColor,
  decorator,
  tabIndex,
  analyticsLinkName,
  analyticsSource,
}) => {
  const analyticsAttributes = useAnalyticsAttributes();
  const [decoratorOnHover, setDecoratorOnHover] = useState(false);

  const onClick = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: analyticsLinkName,
        source: analyticsSource,
        attributes: {
          eventContainer: 'navigation',
          ...analyticsAttributes,
          event: 'clicked',
          eventComponent: 'link',
          label: titleHeading,
          href: url,
          isMarketingEvent: true,
        },
      }),
    [
      analyticsAttributes,
      titleHeading,
      url,
      analyticsLinkName,
      analyticsSource,
    ],
  );

  const onMouseEnter = useCallback(() => setDecoratorOnHover(true), []);
  const onMouseLeave = useCallback(() => setDecoratorOnHover(false), []);

  const backgroundColorPrefix = getColorInitial(
    iconColor,
  ) as keyof typeof BACKGROUND_COLORS;

  const iconColorPrefix = (iconColor?.charAt(0) ||
    'N') as keyof typeof ICON_COLORS;

  const navLinkStyle = useMemo(
    () => ({
      '--marketing-nav-link-hover-background-color':
        BACKGROUND_COLORS[backgroundColorPrefix],
    }),
    [backgroundColorPrefix],
    // Cast directly as this type in order to support custom variable syntax
  ) as CSSProperties;

  const navIconStyle = useMemo(
    () => ({
      '--marketing-nav-link-icon-color': ICON_COLORS[iconColorPrefix],
    }),
    [iconColorPrefix],
    // Cast directly as this type in order to support custom variable syntax
  ) as CSSProperties;

  return (
    <a
      className={styles.navLink}
      href={url}
      onClick={onClick}
      data-testid="ui-nav-link"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={addBackgroundColorOnHover ? navLinkStyle : undefined}
      tabIndex={tabIndex}
    >
      <div className={styles.navLinkTitleContainer}>
        {icon && (
          <div className={styles.navIcon} style={navIconStyle}>
            {getIcon(icon)}
          </div>
        )}
        <p className={styles.navLinkTitle}>{titleHeading}</p>
        {decorator && decoratorOnHover && (
          <ArrowRight color={token('color.icon.accent.purple', '#8270DB')} />
        )}
      </div>
      <div className={styles.navLinkDescription}>
        <p>{description}</p>
      </div>
    </a>
  );
};
