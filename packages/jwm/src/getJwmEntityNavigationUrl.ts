import { identityBaseUrl } from '@trello/config';
import type { PIIString } from '@trello/privacy';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

/**
 * Send all users through the Identity login flow to mimic the Product Switcher links
 * If the user is a member of the JWM instance: direct them to /projects
 * If the user is not a member: direct them to /your-work (which will prompt a request access modal)
 */

export const getJwmEntityNavigationUrl = ({
  entityUrl,
  email,
}: {
  entityUrl: string;
  email?: PIIString;
}): { jwmProjectsUrl: string; jwmYourWorkUrl: string } => {
  const jwmProjectsUrl = () => {
    const params = new URLSearchParams({
      prompt: 'none',
      login_hint: dangerouslyConvertPrivacyString(email) ?? '',
      continue: `${entityUrl}/jira/projects`,
      application: 'jira',
    });

    return `${identityBaseUrl}/login?${params.toString()}`;
  };

  return {
    jwmProjectsUrl: jwmProjectsUrl(),
    jwmYourWorkUrl: `${entityUrl}/jira/your-work`,
  };
};
