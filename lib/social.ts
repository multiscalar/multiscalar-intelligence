// Company social profiles, shared by the footer and the Company menu.
// PLACEHOLDER: only GitHub is confirmed. Replace the "#" links with the real
// X, LinkedIn and Discord profiles.

export type SocialIcon = "github" | "x" | "linkedin" | "discord";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/multiscalar", icon: "github" },
  { label: "X", href: "#", icon: "x" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Discord", href: "#", icon: "discord" },
];

// External profiles open in a new tab.
export const externalProps = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
