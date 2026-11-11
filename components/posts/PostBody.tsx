import Markdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import { BidsPerFee, DualApproach, ProfitByModel, SplitRaid, ValueSplit } from "@/components/posts/AuctionCharts";

// Post bodies are our own trusted markdown (rehype-raw allows the little
// inline HTML the math snippets need, e.g. subscripts, plus <video> and the
// chart tags below).
const MD_COMPONENTS = {
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 font-sans text-[1.4rem] font-semibold leading-[1.25] tracking-[-0.02em] text-black">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-9 mb-3 font-sans text-[1.1rem] font-semibold tracking-[-0.01em] text-black">{children}</h3>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto whitespace-pre-wrap rounded-[12px] border border-black/10 bg-[#f4f3f0] p-4 font-mono text-[0.74rem] leading-[1.6] text-black/75 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.82rem] leading-[1.5]">{children}</table>
    </div>
  ),
  caption: ({ children }) => (
    <caption className="caption-bottom pt-3 text-left text-[0.82rem] leading-[1.6] text-black/50">{children}</caption>
  ),
  th: ({ children, ...rest }) => (
    <th {...rest} className="border-b border-black/30 px-2 py-2 align-bottom font-medium text-black">{children}</th>
  ),
  td: ({ children, ...rest }) => (
    <td {...rest} className="border-b border-black/[0.08] px-2 py-2 align-top text-black/70">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-black/20 pl-5 [&_p]:text-black/80">{children}</blockquote>
  ),
  video: (props) => (
    <video {...props} className="my-8 block h-auto w-full rounded-[14px] border border-black/10 bg-[#ececea]" />
  ),
  figcaption: ({ children }) => (
    <figcaption className="-mt-5 mb-8 text-[0.82rem] leading-[1.6] text-black/50">{children}</figcaption>
  ),
  "value-split": ValueSplit,
  "dual-approach": DualApproach,
  "split-raid": SplitRaid,
  "bids-per-fee": BidsPerFee,
  "profit-by-model": ProfitByModel,
  p: ({ children }) => (
    <p className="text-[0.98rem] leading-[1.75] text-text-secondary mb-5 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-5 mb-5 text-[0.98rem] leading-[1.75] text-text-secondary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-5 mb-5 text-[0.98rem] leading-[1.75] text-text-secondary">
      {children}
    </ol>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-text border-b border-[#c9c7c2] hover:border-black hover:text-black"
      {...(href?.startsWith("http")
        ? { target: "_blank", rel: "noopener" }
        : {})}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-medium text-black">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="font-mono text-[0.85em] bg-[#f0efec] px-1 rounded">
      {children}
    </code>
  ),
} as Components;

export default function PostBody({ body }: { body: string }) {
  return (
    <Markdown rehypePlugins={[rehypeRaw]} components={MD_COMPONENTS}>
      {body}
    </Markdown>
  );
}
