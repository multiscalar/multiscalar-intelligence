// Draft methodology for ZeroSum-Bench, written from the published run data
// and the benchmark blurb; placeholder copy until the full write-up lands.

const P = "text-[0.92rem] leading-[1.7] text-text-secondary mb-4 max-w-[680px]";
const H3 =
  "font-sans text-[0.95rem] font-medium text-black mt-7 mb-2 tracking-[-0.01em]";

export default function ZeroSumBenchAbout() {
  return (
    <>
      <section id="how-it-works" className="bench-section scroll-mt-28">
        <div className="bench-head">
          <div className="bench-title-block">
            <h2>How it works</h2>
            <div className="bench-question">
              Draft notes, ahead of the full write-up.
            </div>
          </div>
        </div>

        <h3 className={H3}>The game</h3>
        <p className={P}>
          Models negotiate directly against each other for money. Every model
          plays every other model in ordered pairings (12 models, all 144
          pairings, on the order of a thousand episodes per model), so a score
          is earned against the whole field, never against a fixed scripted
          opponent. What one side gains, the other side gave up: the benchmark
          measures who walks away with the money that actually changed hands.
        </p>

        <h3 className={H3}>Three mechanisms</h3>
        <p className={P}>
          Each pairing meets across three classic economic mechanisms:
          bilateral trade (a buyer and a seller haggling over a deal with
          private values), a first-price auction (bids are committed, the
          winner pays their bid), and a provision-point game (a shared pot
          that pays out only if contributions clear a threshold). The mix
          rewards different skills: price discovery, bid shading, and
          credible commitment.
        </p>

        <h3 className={H3}>What the numbers mean</h3>
        <p className={P}>
          Claim share is the fraction of the realized surplus an agent keeps
          for itself; 50% is an even split, and higher means it takes more
          from the agents it faces. Efficiency is how much of the available
          surplus a pairing realizes at all: an auction that overshoots
          destroys money nobody gets. The dominated rate tracks how often an
          agent plays a move that is strictly worse than an available
          alternative, regardless of what the opponent does.
        </p>
      </section>

      <section id="scoring-notes" className="bench-section scroll-mt-28">
        <div className="bench-head">
          <div className="bench-title-block">
            <h2>Scoring</h2>
          </div>
        </div>
        <p className={P}>
          The headline metric is money extracted as a share of what changed
          hands, averaged across the three mechanisms and the full field of
          opponents. The head-to-head view breaks the same episodes down by
          pairing: edge is how many points of the available surplus one model
          takes above or below a specific opponent, so a model can look
          strong on average and still have a losing matchup.
        </p>
        <p className={P}>
          The benchmark design builds on the strategic-negotiation setting
          in the paper linked below the leaderboard; the arena, the pairing
          schedule, and the scoring are ours.
        </p>
      </section>
    </>
  );
}
