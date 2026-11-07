import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that apply to using the Multiscalar Intelligence website, its research and its benchmark results.",
  path: "/terms/",
});

// DRAFT for legal review.
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="7 October 2026">
      <p>
        These terms apply to your use of multiscalar.ai (the &ldquo;site&rdquo;),
        run by [Legal entity name] (&ldquo;Multiscalar&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;), a company registered in England and Wales with
        company number [number]. By using the site, you agree to them. If you
        don&apos;t agree, please don&apos;t use the site.
      </p>

      <h2>Using the site</h2>
      <p>
        You may browse, read and share the site for any lawful purpose. Please
        don&apos;t attempt to disrupt it, access it in ways that put an
        unreasonable load on it, or use it to break the law.
      </p>

      <h2>Our content</h2>
      <p>
        Unless stated otherwise, the site&apos;s text, design, images and
        trademarks belong to us or our licensors. Research write-ups, code and
        data that we publish openly carry their own licence, shown alongside
        them; that licence governs their use. Quoting short extracts with a
        link back to the source is always welcome.
      </p>

      <h2>Benchmarks and research</h2>
      <p>
        Benchmark results, index scores and research findings are provided for
        information. They reflect specific models, settings and dates, may
        change as we rerun evaluations, and some figures are marked as example
        data. Results attributed to third parties are theirs, shown with
        attribution. Full datasets are available under a separate agreement.
      </p>

      <h2>Not advice</h2>
      <p>
        Nothing on the site is financial, investment, legal or other
        professional advice, and nothing on it is an offer to provide any
        service. Talk to a qualified adviser before making decisions based on
        it.
      </p>

      <h2>Links to other sites</h2>
      <p>
        We link to sites we don&apos;t control, such as papers, code
        repositories and partners. We aren&apos;t responsible for their content
        or practices.
      </p>

      <h2>Liability</h2>
      <p>
        We work to keep the site accurate and available, but we provide it
        &ldquo;as is&rdquo;, without warranties of any kind. To the extent the
        law allows, we aren&apos;t liable for any loss arising from your use of
        the site or reliance on its content. Nothing in these terms limits
        liability that cannot be limited by law, such as for death or personal
        injury caused by negligence, or for fraud.
      </p>

      <h2>Privacy</h2>
      <p>
        Our <a href="/privacy/">Privacy Policy</a> explains how we handle
        personal data.
      </p>

      <h2>Changes and governing law</h2>
      <p>
        We may update these terms; the date at the top shows the latest
        version. These terms are governed by the laws of England and Wales, and
        the courts of England and Wales have exclusive jurisdiction.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? <a href="/contact/">Contact us</a>.
      </p>
    </LegalPage>
  );
}
