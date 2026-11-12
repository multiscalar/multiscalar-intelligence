"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EMAIL = "info@multiscalar.ai";

type View = "home" | "company" | "research" | "contact";
const VIEWS: View[] = ["home", "company", "research", "contact"];
const MENU: { view: Exclude<View, "home">; label: string }[] = [
  { view: "company", label: "Company" },
  { view: "research", label: "Research" },
  { view: "contact", label: "Contact" },
];

// The previous site's logo strip, in public/logos/. Heights balance wide
// wordmarks against compact marks.
const LOGOS = [
  { name: "University of Oxford", src: "/logos/oxford.svg", height: 30 },
  { name: "Stanford University", src: "/logos/stanford.svg", height: 17 },
  { name: "ARIA, Advanced Research and Invention Agency", src: "/logos/aria.png", height: 30 },
  { name: "Ethereum Foundation", src: "/logos/ethereum-foundation.svg", height: 32 },
  { name: "Microsoft", src: "/logos/microsoft.svg", height: 19 },
  { name: "IBM", src: "/logos/ibm.svg", height: 20 },
  { name: "European Space Agency", src: "/logos/esa.svg", height: 22 },
  { name: "Lyft", src: "/logos/lyft.svg", height: 24 },
];

const viewFromHash = (hash: string): View => {
  const v = hash.replace(/^#/, "") as View;
  return VIEWS.includes(v) ? v : "home";
};

export default function Landing() {
  const [view, setView] = useState<View>("home");
  const headings = useRef<Partial<Record<View, HTMLElement | null>>>({});

  useEffect(() => {
    const sync = () => setView(viewFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const go = useCallback((next: View) => {
    setView(next);
    const url = next === "home" ? window.location.pathname : `#${next}`;
    history.pushState(null, "", url);
    // Move focus once the panel has started to appear.
    window.setTimeout(() => headings.current[next]?.focus({ preventScroll: true }), 60);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && view !== "home") go("home");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, go]);

  const panel = (v: View) => ({
    className: `view${view === v ? " on" : ""}`,
    "aria-hidden": view !== v,
    inert: view !== v,
  });
  const heading = (v: View) => (el: HTMLElement | null) => {
    headings.current[v] = el;
  };
  const back = (
    <button type="button" className="link back" onClick={() => go("home")}>
      Home
    </button>
  );

  return (
    <main className="stage" data-view={view}>
      {/* The aerial port photo, mirrored so the sea sits behind the text,
          toned to black and orange, drifting very slowly. */}
      <div className="photo" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/port.webp" alt="" width={1600} height={686} fetchPriority="high" />
      </div>
      <div className="scrim" aria-hidden />

      <a className="brand" href="/" onClick={(e) => { e.preventDefault(); go("home"); }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/wordmark.svg" alt="Multiscalar Intelligence" width={9063} height={1854} />
      </a>

      <a className="corner" href={`mailto:${EMAIL}`}>
        <span className="pip" aria-hidden />
        {EMAIL}
      </a>

      <div className="dock">
        <div {...panel("home")}>
          <nav aria-label="Main">
            <ul className="menu">
              {MENU.map((m) => (
                <li key={m.view}>
                  <a
                    className="link"
                    href={`#${m.view}`}
                    onClick={(e) => { e.preventDefault(); go(m.view); }}
                  >
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <h1 className="title" ref={heading("home")} tabIndex={-1}>
            Self-improving AI that runs businesses
          </h1>
          <p className="tag">The applied AI lab for economic intelligence</p>
        </div>

        <section {...panel("company")} aria-labelledby="h-company">
          <p className="eyebrow">Company</p>
          <h2 id="h-company" ref={heading("company")} tabIndex={-1}>
            We turn how organizations operate into environments where AI trains itself.
          </h2>
          <p className="lead">
            AI is moving from completing tasks to making economic decisions: pricing risk,
            contracting across supply chains, allocating capital, negotiating deals. The next
            advantage is not who uses AI, but whose AI makes better decisions.
          </p>
          <p className="fine">
            Founded by researchers and engineers in AI, economics and security, from Oxford, the
            Ethereum Foundation, ESA and Lyft.
          </p>
          <div className="foot">{back}</div>
        </section>

        <section {...panel("research")} aria-labelledby="h-research">
          <p className="eyebrow">Research</p>
          <h2 id="h-research" ref={heading("research")} tabIndex={-1}>
            Security is the bottleneck. We measure it.
          </h2>
          <p className="lead">
            Enterprises can&rsquo;t deploy what they can&rsquo;t secure, and they can&rsquo;t
            secure what they can&rsquo;t measure. EconSec Bench puts AI in adversarial economic
            environments, where an attacker tries to exploit it.
          </p>
          <p className="fine">
            Agents run shops, payments, spend, CRM and accounting systems modelled on real
            platforms. Research partners include ESA, ARIA, the University of Oxford and Together
            AI.
          </p>
          <div className="foot">{back}</div>
        </section>

        <section {...panel("contact")} aria-labelledby="h-contact">
          <p className="eyebrow">Contact</p>
          <h2 id="h-contact" ref={heading("contact")} tabIndex={-1}>
            Talk to us.
          </h2>
          <p className="lead">Research partnerships, deployments, or anything else.</p>
          <a className="mail" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <div className="foot">{back}</div>
        </section>
      </div>

      <section className="partners" aria-label="Partners">
        <div className="pt-track">
          {[0, 1].map((copy) => (
            <ul className="pt-run" key={copy} aria-hidden={copy === 1}>
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <li key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={copy === 1 || i >= LOGOS.length ? "" : logo.name}
                    style={{ "--h": `${logo.height}px` } as React.CSSProperties}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>
    </main>
  );
}
