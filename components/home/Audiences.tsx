import { IconArrowRight } from "central-icons";
import Reveal from "@/components/Reveal";

// The home page's closing band, ember with ink: three doors, each one large
// link row (who it is for, what they get, one line of detail). The whole row
// is the link; its arrow slides and the row darkens slightly on hover.
const PATHS = [
  {
    who: "For businesses",
    title: "Run your workflows on Blacksmith",
    body: "A private agent trained on how your company runs, with spend limits and sign-off on every action.",
    href: "/blacksmith/#get-in-touch",
  },
  {
    who: "For researchers",
    title: "Build on our research",
    body: "Proofs, benchmarks and code are public, including results that went against us.",
    href: "/open-science/",
  },
  {
    who: "For builders",
    title: "Join the team in London",
    body: "A small team working on agents that negotiate, price and allocate capital.",
    href: "/work-with-us/",
  },
];

export default function Audiences() {
  return (
    <section id="start" className="px-3 pb-3 scroll-mt-24 max-[768px]:px-2 max-[768px]:pb-2">
      <div className="rounded-[28px] bg-ember text-ember-ink max-[768px]:rounded-[20px]">
        <div className="mx-auto max-w-[1200px] px-8 pt-20 pb-10 max-[768px]:px-6 max-[768px]:pt-14 max-[768px]:pb-6">
          <Reveal className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-10 max-[860px]:grid-cols-1 max-[860px]:gap-5">
            <h2 className="font-sans text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              Work with Multiscalar
            </h2>
            <p className="max-w-[340px] pb-2 text-[1.05rem] leading-[1.55] text-ember-ink/85">
              Whether you run a business, do research or want to build this with us, start here.
            </p>
          </Reveal>

          <Reveal className="mt-14 max-[768px]:mt-10">
            <ul className="border-t border-ember-ink/25">
              {PATHS.map((p) => (
                <li key={p.href} className="border-b border-ember-ink/25 last:border-b-0">
                  <a
                    href={p.href}
                    className="group -mx-4 grid grid-cols-[10rem_minmax(0,1fr)_auto] items-center gap-8 rounded-[16px] px-4 py-8 text-ember-ink transition-colors duration-300 hover:bg-ember-ink/[0.06] hover:text-ember-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-ink max-[860px]:grid-cols-[minmax(0,1fr)_auto] max-[860px]:gap-x-5 max-[860px]:gap-y-2 max-[860px]:py-6"
                  >
                    <span className="text-[0.85rem] font-medium text-ember-ink/85 max-[860px]:col-span-2">{p.who}</span>
                    <span>
                      <span className="block text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
                        {p.title}
                      </span>
                      <span className="mt-2 block max-w-[560px] text-[1rem] leading-[1.55] text-ember-ink/85">
                        {p.body}
                      </span>
                    </span>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-ember-ink text-ember transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 max-[860px]:h-10 max-[860px]:w-10">
                      <IconArrowRight aria-hidden strokeWidth={2} className="h-5 w-5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
