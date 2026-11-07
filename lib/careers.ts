// PLACEHOLDER open roles: titles, teams and locations are stand-ins for
// layout only. Replace with the real openings (or an ATS link per role)
// before launch.

export interface Role {
  title: string;
  team: string;
  location: string;
  /** Application link; defaults to an email to careers@ with the title. */
  href?: string;
}

export const ROLES: Role[] = [
  { title: "Research Scientist, Multi-Agent RL", team: "Research", location: "London" },
  { title: "Research Engineer, Environments", team: "Research", location: "London" },
  { title: "Member of Technical Staff, Evaluations", team: "Evals", location: "London or remote" },
  { title: "Forward Deployed Engineer", team: "Deployment", location: "London" },
];

export const roleHref = (r: Role) =>
  r.href ??
  `mailto:careers@multiscalar.ai?subject=${encodeURIComponent(`Application: ${r.title}`)}`;
