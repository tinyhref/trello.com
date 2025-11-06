/**
 * Given the maximum number of members in an organization, calculate the threshold
 * of available licenses at which we should show the seat cap banner.
 * i.e. 5% of the total number of licenses or 20, whichever is less.
 * @param maxMembers Maximum number of licenses that the organizations has
 * @returns minimum threshold of available licenses to show the banner
 */
export const getSeatCapThreshold = (maxMembers: number) => {
  const threshold = Math.min(Math.ceil(maxMembers * 0.05), 20);
  return threshold;
};
