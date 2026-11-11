import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/home/SectionHeader";

// The founders, with the credentials from the client deck (2026-11-09).
const FOUNDERS = [
  {
    name: "Davide Crapis",
    role: "CEO and co-founder",
    photo: "/team/davide.jpg",
    facts: ["Head of AI, Ethereum Foundation", "Led pricing AI at Lyft", "Co-author of ERC-8004"],
  },
  {
    name: "Samuele Marro",
    role: "Co-founder",
    photo: "/team/samuele.jpg",
    facts: ["PhD researcher, University of Oxford", "NeurIPS and ICML author", "Founder of IDAI"],
  },
  {
    name: "Marcello Politi",
    role: "Co-founder",
    photo: "/team/marcello.jpg",
    facts: ["Post-training lead, European Space Agency", "AI research, Ethereum Foundation", "Agent payments, x402"],
  },
];

export default function Team() {
  return (
    <section id="team" className="section-y scroll-mt-24">
      <SectionHeader
        label="Who we are"
        title="Researchers in AI, economics and security"
        link={{ href: "/work-with-us/", label: "Work with us" }}
      />
      <Reveal className="grid grid-cols-3 gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        {FOUNDERS.map((f) => (
          <div key={f.name} className="flex gap-5">
            <Image
              src={f.photo}
              alt={f.name}
              width={88}
              height={88}
              className="h-[88px] w-[88px] shrink-0 rounded-full object-cover grayscale"
            />
            <div>
              <h3 className="font-sans text-[1.15rem] font-semibold tracking-[-0.02em] text-black">{f.name}</h3>
              <p className="mt-0.5 text-[0.88rem] text-black/50">{f.role}</p>
              <ul className="mt-3 flex flex-col gap-1 text-[0.88rem] leading-[1.5] text-black/70">
                {f.facts.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
