import { useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { TrelloWindow } from '@trello/window-types';

import { scrubUrl } from 'app/src/scrubUrl';
declare const window: TrelloWindow;

const sanitizeReportUrl = (url: string) => {
  switch (url) {
    case '':
    case 'about:':
    case 'about:blank':
    case 'android-webview':
    case 'chrome-extension':
    case 'data':
    case 'eval':
    case 'inline':
    case 'moz-extension':
    case 'ms-browser-extension':
    case 'self':
      return url;
    default:
      return scrubUrl(url);
  }
};

const sendSecurityPolicyViolationEvent = (
  event: SecurityPolicyViolationEvent,
  info?: {
    early: boolean;
  },
) => {
  // eslint-disable-next-line @trello/no-query-selector
  const metaTag = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]',
  );
  if (
    event.originalPolicy === metaTag?.getAttribute('content') &&
    event.sourceFile !== 'chrome-extension'
  ) {
    Analytics.sendOperationalEvent({
      action: 'failed',
      actionSubject: 'securityCheck',
      attributes: {
        blockedURI: sanitizeReportUrl(event.blockedURI),
        columnNumber: event.columnNumber,
        disposition: event.disposition,
        documentURI: sanitizeReportUrl(event.documentURI),
        effectiveDirective: event.effectiveDirective,
        lineNumber: event.lineNumber,
        originalPolicy: event.originalPolicy,
        referrer: sanitizeReportUrl(event.referrer),
        sourceFile: sanitizeReportUrl(event.sourceFile),
        statusCode: event.statusCode,
        violatedDirective: event.violatedDirective,
        info,
      },
      source: getScreenFromUrl(),
    });
  }
};

const reportEarlySecurityPolicyViolations = () => {
  if (Array.isArray(window.__EARLY_SECURITY_POLICY_VIOLATIONS)) {
    window.__EARLY_SECURITY_POLICY_VIOLATIONS.map(
      (violation: SecurityPolicyViolationEvent) => {
        sendSecurityPolicyViolationEvent(violation, { early: true });
      },
    );
  }

  document.removeEventListener(
    'securitypolicyviolation',
    window.securityPolicyViolationEarlyListener,
  );
};

export const useSecurityPolicyViolationReporter = () => {
  useEffect(() => {
    reportEarlySecurityPolicyViolations();
  }, []);

  useEffect(() => {
    document.addEventListener(
      'securitypolicyviolation',
      sendSecurityPolicyViolationEvent,
    );

    return () => {
      document.removeEventListener(
        'securitypolicyviolation',
        sendSecurityPolicyViolationEvent,
      );
    };
  }, []);
};
