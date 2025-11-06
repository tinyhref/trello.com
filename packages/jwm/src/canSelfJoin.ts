import { executeAccessRequestCapabilities } from '@trello/id-invitations-service';

export const canSelfJoin = async (
  idCloud: string | undefined,
): Promise<{
  result: boolean;
  userAccessLevel?: string;
  hasDirectAccess?: boolean;
  verificationStatus?: string;
}> => {
  const capabilities = await executeAccessRequestCapabilities(idCloud);
  if (capabilities) {
    const accessLevelPass: boolean = ['EXTERNAL', 'INTERNAL'].includes(
      capabilities.userAccessLevel,
    );
    const directAccessPass = !!capabilities.resultsV2[
      `ari:cloud:jira-software::site/${idCloud}`
    ]?.some(
      (detail: { accessMode: string }) => detail.accessMode === 'DIRECT_ACCESS',
    );
    const verificationNotRequired =
      capabilities.verificationStatus === 'NOT_REQUIRED';
    return {
      result: accessLevelPass && directAccessPass && verificationNotRequired,
      userAccessLevel: capabilities.userAccessLevel,
      hasDirectAccess: directAccessPass,
      verificationStatus: capabilities.verificationStatus,
    };
  }

  return { result: false };
};
