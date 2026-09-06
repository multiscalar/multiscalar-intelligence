// The six proposed solutions, each linking to its paper page.

export const ERDOS_PROBLEMS = [
  {
    number: "390",
    title: (
      <>
        An exact asymptotic for the least largest factor of a factorisation of{" "}
        <em>n</em>!
      </>
    ),
    tag: "Number Theory",
  },
  {
    number: "486",
    title: <>A sieve whose survivors have no logarithmic density</>,
    tag: "Number Theory",
  },
  {
    number: "536",
    title: (
      <>
        Sets with no three equal pairwise least common multiples have density
        zero
      </>
    ),
    tag: "Combinatorics",
  },
  {
    number: "788",
    title: (
      <>
        The trade-off function is a square root, up to <em>n</em>
        <sup>o(1)</sup>
      </>
    ),
    tag: "Additive Combinatorics",
  },
  {
    number: "1002",
    title: <>Rotation discrepancy converges to a Cauchy law</>,
    tag: "Equidistribution",
  },
  {
    number: "1038",
    title: <>The exact infimum of a polynomial sublevel set</>,
    tag: "Approximation Theory",
  },
];

export default function ErdosProblemList() {
  return (
    <ul className="list-none max-w-[820px] mt-2 mb-6 border-t border-[#e4e2dd]">
      {ERDOS_PROBLEMS.map((p) => (
        <li key={p.number} className="border-b border-[#e4e2dd]">
          <a
            href={`/results/erdos-${p.number}/`}
            className="group grid grid-cols-[4.2rem_1fr_auto] items-baseline gap-x-[1.2rem] py-[0.95rem] px-[0.2rem] text-text transition-[background,padding-left] duration-[0.25s] hover:bg-bg-elevated hover:pl-[0.8rem] max-[640px]:grid-cols-[3.4rem_1fr]"
          >
            <span className="font-mono text-[0.86rem] text-text-dim tracking-[0.06em] group-hover:text-[#1a1a1a]">
              {p.number}
            </span>
            <span className="font-sans text-[0.98rem] text-[#1a1a1a] leading-[1.45]">
              {p.title}
            </span>
            <span className="font-mono text-[0.68rem] text-text-dim tracking-[0.14em] uppercase whitespace-nowrap max-[640px]:col-start-2 max-[640px]:mt-[0.3rem]">
              {p.tag}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
