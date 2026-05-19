/**
 * Scroll margin aligns section titles with the sidebar "Profile" nav row
 * (topbar h-14 + main offset ≈ 5.5rem).
 */
export const SCROLL_MT = 'scroll-mt-[5.5rem]';

/** Full viewport section height below topbar */
export const SECTION_MIN_H = 'min-h-[calc(100vh-5.5rem)]';

/** Shared section shell — title sits at top, no extra offset */
export const SECTION_SHELL = `${SCROLL_MT} px-4 sm:px-8 pt-0`;
