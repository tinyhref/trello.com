export interface Avatars {
  [size: string]: string;
}

/**
 * Returns the `Avatars` object for different sizes ('30', '50', '170', 'original') by using the provided URL.
 */
export function avatarsFromAvatarUrl(
  avatarUrl: string,
  atlassianAvatar?: boolean,
): Avatars {
  return ['30', '50', '170', 'original'].reduce((avatars: Avatars, size) => {
    avatars[size] = atlassianAvatar ? avatarUrl : `${avatarUrl}/${size}.png`;
    return avatars;
  }, {});
}
