// Things hidden while the site is in private preview. Each switch is used in
// one place; set it to false to bring that part back. docs/hidden-for-launch.md
// lists everything hidden (including what isn't a switch) and how to revert.
export const HIDE = {
  /** The Evals menu in the header (desktop and phone). Pages stay live. */
  evalsInHeader: false,
  /** The dark Economic Intelligence Index section on the home page. */
  homeIndexSection: true,
  /** Links to the evals outside the evals pages: shown, but disabled with a
   *  "Coming soon" tag. Also hides the Treasury-Bench announcement band, the
   *  benchmark cards on research pages and the ZeroSum-Bench paper link. */
  evalsLinks: false,
};

// True for a link that should render as "Coming soon" instead of a link.
// Only used outside the evals pages, which still link to each other.
export const evalsSoon = (href: string) => HIDE.evalsLinks && href.startsWith("/evals");
