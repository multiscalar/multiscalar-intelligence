// Extended methodology for Treasury-Bench (sample episodes live on the
// Samples tab).
// Written at the public disclosure level of the shared traces README:
// institutional constants (USDC, ACH, wire, Circle) are named plainly;
// the replay window, real venues, and price paths are not.


const P = "text-[0.92rem] leading-[1.7] text-text-secondary mb-4 max-w-[680px]";
const H3 =
  "font-sans text-[0.95rem] font-medium text-black mt-7 mb-2 tracking-[-0.01em]";

export default function TreasuryBenchAbout() {
  return (
    <>
      <section id="how-it-works" className="bench-section scroll-mt-28">
        <div className="bench-head">
          <div className="bench-title-block">
            <h2>How it works</h2>
          </div>
        </div>

        <h3 className={H3}>The job</h3>
        <p className={P}>
          The agent is the treasurer of a small company. It starts with about
          $100,000, faces a year-long calendar of obligations, some arriving
          unannounced, and is judged on the final statement of the treasury.
          It receives a mandate, not a reward function: stay solvent, pay
          every obligation on time, preserve capital, and only then earn a
          return on genuine surplus.
        </p>

        <h3 className={H3}>The world</h3>
        <p className={P}>
          Every episode runs against replayed recorded market history: a
          volatile native asset, a dollar stablecoin, an exchange pool with
          recorded depth, and a lending venue paying its genuinely recorded
          rates. Gas dynamics are measured from the real chain, and a
          lowballed transaction stays pending. The world never invents a
          price, a rate, or a fee: if it wasn&apos;t recorded or measured,
          the agent can&apos;t touch it. All world arithmetic is integer, so
          identical commands produce identical bytes, forever.
        </p>
        <p className={P}>
          Paying a bill is a pipeline, not a button: withdraw from the
          lending position if needed, swap into USDC, redeem through the
          off-ramp into bank dollars, then pay by ACH ($1, next banking day)
          or wire ($25, same day), against real cutoffs, weekends, and bank
          holidays. A payment keyed after the cutoff waits for the next
          banking morning, and a bill is judged by when it settles, not when
          the agent pressed the button.
        </p>
        <p className={P}>
          Time is event-driven and only advances while the agent waits.
          Submitting an action merely queues it; nothing in the world moves
          between the agent&apos;s actions, so an episode is a fully
          determined function of the command sequence, and attentiveness
          shows up in the trace as call cadence. The agent operates through
          14 tools: reads, mutations, and two ways to wait.
        </p>

        <h3 className={H3}>Keeping it honest</h3>
        <p className={P}>
          Anything a model could recall from training data is renamed and
          undated: the volatile asset, the venues, and the calendar are
          fictional (&ldquo;Year 1, Day 107, Tuesday&rdquo;), while true
          constants (USDC, ACH, wire, Circle) are spoken plainly, because
          knowing a stablecoin is a dollar leaks nothing. Every episode is
          scanned automatically for alias leaks, and every episode can be
          replayed byte-for-byte from its recorded evidence: a score you
          can&apos;t replay is a score you shouldn&apos;t trust. Full evidence
          bundles and a live replay are available on request at{" "}
          <a href="mailto:hello@multiscalar.ai">hello@multiscalar.ai</a>.
        </p>
      </section>

      <section id="scoring" className="bench-section scroll-mt-28">
        <div className="bench-head">
          <div className="bench-title-block">
            <h2>Scoring</h2>
          </div>
        </div>
        <p className={P}>
          The score is the treasury left at the year&apos;s close, net of
          penalties, reported on the leaderboard as value added over a
          scripted prudent treasurer that keeps a float, lends the rest, and
          pays every bill on time. Zero means no better than playing it
          safe; below zero, the agent lost money the obvious policy would
          have kept. A late payment costs a one-off 1.4% fee; anything still
          unpaid at the close goes to collection with a 20% surcharge. Raw
          return alone is never rewarded: a treasurer who gambles the
          payroll is failing the job even when the bet pays off.
        </p>
        <p className={P}>
          The scripted references are part of the benchmark: doing nothing
          closes $19,696.65 underwater, the prudent policy is the zero every
          score is measured from, and the gambler round trip on the board is
          the pinned demonstration that converting the treasury stays legal,
          executes cleanly, and is priced. If a scripted policy beats a
          frontier model, that is a result, not an embarrassment to hide.
        </p>
      </section>

    </>
  );
}
