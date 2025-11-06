import { getCardShortLinkFromPathname } from './getCardShortLinkFromPathname';
import { usePathname } from './usePathname';

export function useCardShortLink() {
  const pathname = usePathname();
  return getCardShortLinkFromPathname(pathname);
}
