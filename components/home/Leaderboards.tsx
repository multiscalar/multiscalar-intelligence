import LeaderboardCarousel from "@/components/home/LeaderboardCarousel";
import { benchCards } from "@/lib/evals/cards";

// Live top five per benchmark, plus the announced ones, as a carousel.
export default function Leaderboards() {
  return (
    <section className="p-3 max-[768px]:p-2">
      <div className="overflow-hidden rounded-[28px] panel-dark max-[768px]:rounded-[20px]">
        <div className="pt-20 pb-28 max-[768px]:pt-14 max-[768px]:pb-20">
          <LeaderboardCarousel cards={benchCards()} />
        </div>
      </div>
    </section>
  );
}
