import Markdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";

// Post bodies are our own trusted markdown (rehype-raw allows the little
// inline HTML the math snippets need, e.g. subscripts).
const MD_COMPONENTS: Components = {
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
};

export default function PostBody({ body }: { body: string }) {
  return (
    <Markdown rehypePlugins={[rehypeRaw]} components={MD_COMPONENTS}>
      {body}
    </Markdown>
  );
}
