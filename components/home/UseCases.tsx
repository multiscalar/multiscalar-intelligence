import {
  IconBank,
  IconBasket1,
  IconBox2,
  IconCreditCard1,
  IconHandshake,
  IconPieChart1,
} from "central-icons";

type IconComponent = typeof IconBank;
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/home/SectionHeader";

// The economic functions we start with, from the vision doc.
const USE_CASES: { title: string; body: string; icon: IconComponent }[] = [
  {
    title: "Investment management",
    body: "Research opportunities, allocate capital, and manage portfolios within defined risk limits.",
    icon: IconPieChart1,
  },
  {
    title: "Treasury",
    body: "Manage liquidity, payment obligations, and yield.",
    icon: IconBank,
  },
  {
    title: "Procurement",
    body: "Source suppliers, compare offers, negotiate terms, and execute purchases.",
    icon: IconBasket1,
  },
  {
    title: "Pricing and negotiation",
    body: "Set prices and negotiate agreements based on demand, costs, and counterparty behaviour.",
    icon: IconHandshake,
  },
  {
    title: "Credit",
    body: "Evaluate borrowers, structure financing, and monitor repayment risk.",
    icon: IconCreditCard1,
  },
  {
    title: "Operations",
    body: "Allocate resources, manage inventory, and coordinate suppliers as conditions change.",
    icon: IconBox2,
  },
];

export default function UseCases() {
  return (
    <section className="section-b">
      <SectionHeader
        label="Use cases"
        title="From single functions to autonomous organizations"
        description="We start with individual economic functions and build toward organizations that can coordinate them autonomously."
      />
      <div className="grid grid-cols-3 gap-4 max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
        {USE_CASES.map(({ title, body, icon: Icon }, i) => (
          <Reveal key={title} delay={(i % 3) * 0.06}>
            <div className="group h-full rounded-[20px] bg-white p-8 transition-colors duration-300 hover:bg-[#0c0c0c] max-[768px]:p-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-bg text-black transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white">
                  <Icon aria-hidden strokeWidth={1.7} className="w-5 h-5" />
                </span>
                <span className="text-[0.75rem] font-semibold tabular-nums text-text-dim transition-colors duration-300 group-hover:text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-10 font-sans text-[1.2rem] font-semibold tracking-[-0.02em] text-black transition-colors duration-300 group-hover:text-white max-[768px]:mt-8">
                {title}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#666] transition-colors duration-300 group-hover:text-white/65">
                {body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
