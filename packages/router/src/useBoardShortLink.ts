import { getBoardShortLinkFromPathname } from './getBoardShortLinkFromPathname';
import { usePathname } from './usePathname';

export function useBoardShortLink() {
  const pathname = usePathname();
  return getBoardShortLinkFromPathname(pathname);
}
