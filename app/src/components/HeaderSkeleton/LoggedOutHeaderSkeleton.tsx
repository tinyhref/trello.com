import type { FunctionComponent } from 'react';

import { token } from '@trello/theme';

import { LogoTrello } from 'app/src/components/LoggedOutHeader/LogoTrello';

export const LoggedOutHeaderSkeleton: FunctionComponent = () => (
  <div
    data-testid="logged-out-skeleton-header"
    style={{
      minHeight: 60,
      maxHeight: 60,
      background: token('elevation.surface', '#FFFFFF'),
      display: 'flex',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
      }}
    >
      <div style={{ margin: `${token('space.0', '0px')} 14px` }}>
        <LogoTrello height={22.5} navSize="big" />
      </div>
      <div
        style={{
          alignItems: 'stretch',
          display: 'flex',
          flex: '1 0 0',
          padding: `${token('space.250', '20px')} ${token('space.0', '0px')} 14px ${token('space.0', '0px')}`,
        }}
      >
        <div
          style={{
            backgroundColor: token('color.skeleton.subtle', '#091E4208'),
            height: 29,
            width: 104,
            borderRadius: token('radius.small', '3px'),
            margin: `14px ${token('space.025', '2px')}`,
          }}
        />
        <div
          style={{
            backgroundColor: token('color.skeleton.subtle', '#091E4208'),
            height: 29,
            width: 109,
            borderRadius: token('radius.small', '3px'),
            margin: `14px ${token('space.025', '2px')}`,
          }}
        />
        <div
          style={{
            backgroundColor: token('color.skeleton.subtle', '#091E4208'),
            height: 29,
            width: 78,
            borderRadius: token('radius.small', '3px'),
            margin: `14px ${token('space.025', '2px')}`,
          }}
        />
        <div
          style={{
            backgroundColor: token('color.skeleton.subtle', '#091E4208'),
            height: 29,
            width: 78,
            borderRadius: token('radius.small', '3px'),
            margin: `14px ${token('space.025', '2px')}`,
          }}
        />
        <div
          style={{
            backgroundColor: token('color.skeleton.subtle', '#091E4208'),
            height: 29,
            width: 115,
            borderRadius: token('radius.small', '3px'),
            margin: `14px ${token('space.025', '2px')}`,
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            backgroundColor: token('color.skeleton.subtle', '#091E4208'),
            height: 32,
            width: 65,
            borderRadius: token('radius.small', '3px'),
            margin: `${token('space.0', '0px')} ${token('space.200', '16px')}`,
          }}
        />
        <div
          style={{
            backgroundColor: token('color.background.brand.bold', '#0C66E4'),
            height: 60,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: token(
                'color.background.selected.pressed',
                'hsla(0, 0%, 100%, 0.3)',
              ),
              height: 32,
              width: 170,
              borderRadius: token('radius.small', '3px'),
              margin: `${token('space.0', '0px')} ${token('space.200', '16px')}`,
            }}
          />
        </div>
      </div>
    </div>
  </div>
);
