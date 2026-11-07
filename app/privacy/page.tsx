import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Multiscalar Intelligence handles personal data on this website: what we collect, why, how long we keep it and your rights.",
  path: "/privacy/",
});

// DRAFT for legal review. Written from what the site does today: no
// accounts, no analytics or marketing scripts, forms that open the visitor's
// email client, and a consent choice kept in the browser. Update it when any
// of that changes (lib/consent.ts lists the cookie categories).
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="7 October 2026">
      <p>
        This policy explains how [Legal entity name] (&ldquo;Multiscalar&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;), a company registered in England and
        Wales with company number [number] and registered office at [address],
        handles personal data when you visit multiscalar.ai or contact us. We
        are the controller of that data under the UK General Data Protection
        Regulation and the Data Protection Act 2018.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>What you send us.</strong> Our contact and dataset request
          forms open your own email app with your message ready to send. We
          receive only what you choose to send: typically your name, email
          address, organisation and message.
        </li>
        <li>
          <strong>Technical data.</strong> Like any website, our hosting
          provider processes your IP address, browser type and the pages you
          request, to deliver the site and keep it secure.
        </li>
        <li>
          <strong>Your cookie choice.</strong> We store your answer to our
          cookie notice in your browser&apos;s local storage, so we don&apos;t
          ask again on every visit.
        </li>
      </ul>
      <p>
        We don&apos;t currently use analytics, advertising or other
        non-essential cookies. If we add any, they will only run after you
        agree to them, and we will list them here.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>
          To reply to you and handle your request, including access to our
          datasets. Our legal basis is our legitimate interest in responding to
          enquiries or, where we agree to work together, taking steps to enter
          into a contract.
        </li>
        <li>
          To run and secure the website. Our legal basis is our legitimate
          interest in a working, safe site.
        </li>
        <li>
          To remember your cookie choice. This is strictly necessary to respect
          that choice.
        </li>
      </ul>
      <p>We don&apos;t sell your personal data or use it for automated decisions about you.</p>

      <h2>Who we share it with</h2>
      <p>
        We use service providers, such as our website host and email provider,
        who process data on our behalf under contract and only as we instruct.
        We may also disclose data if the law requires it. Some providers may
        process data outside the UK; when they do, we rely on safeguards
        recognised under UK law, such as adequacy regulations or the
        International Data Transfer Agreement.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep correspondence for as long as we need it to deal with your
        request and any follow-up, and then for no longer than [24 months]
        unless we have an ongoing relationship with you. Technical logs are
        kept for a short period set by our hosting provider. Your cookie choice
        stays in your browser until you clear it or change it.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to access, correct or delete your personal data, to
        restrict or object to how we use it, and to receive a copy of it. You
        can change your cookie choice at any time from the &ldquo;Cookie
        settings&rdquo; link at the bottom of every page. To make a request,{" "}
        <a href="/contact/">contact us</a>. We will reply within one month.
      </p>
      <p>
        If you&apos;re unhappy with how we handle your data, you can complain to
        the Information Commissioner&apos;s Office at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a>
        , though we&apos;d appreciate the chance to put it right first.
      </p>

      <h2>Changes</h2>
      <p>
        We will update this policy when our practices change and show the date
        of the latest version at the top of the page.
      </p>
    </LegalPage>
  );
}
