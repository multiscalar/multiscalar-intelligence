import Landing from "@/components/Landing";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Multiscalar Intelligence",
            url: "https://multiscalar.ai/",
            email: "info@multiscalar.ai",
            description:
              "The applied AI lab for economic intelligence. We turn how organizations operate into environments where AI trains itself.",
          }),
        }}
      />
      <Landing />
    </>
  );
}
