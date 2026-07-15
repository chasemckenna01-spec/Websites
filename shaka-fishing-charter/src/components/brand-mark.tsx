import { getCustomLogoSrc } from "@/lib/logo";
import BrandMarkView from "./brand-mark-view";

/**
 * Server-only wrapper: checks /public for a real logo file and renders it,
 * falling back to the line-art marlin mark + wordmark. Use this from Server
 * Components (e.g. Footer). Client Components (e.g. Navbar) should receive
 * `logoSrc` as a prop from a Server Component ancestor and render
 * <BrandMarkView /> directly, since fs access can't ship to the browser.
 */
export default function BrandMark(
  props: Omit<React.ComponentProps<typeof BrandMarkView>, "logoSrc">
) {
  const logoSrc = getCustomLogoSrc();
  return <BrandMarkView logoSrc={logoSrc} {...props} />;
}
