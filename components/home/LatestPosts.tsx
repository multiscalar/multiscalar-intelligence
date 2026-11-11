import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/home/SectionHeader";
import PostCard from "@/components/posts/PostCard";
import { listPosts } from "@/lib/posts";

// The three newest Open Science posts, as covered cards.
export default function LatestPosts() {
  return (
    <section className="section-y">
      <SectionHeader title="Latest from the lab" link={{ href: "/open-science/", label: "All research" }} />
      <Reveal className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-1 max-[900px]:gap-12">
        {listPosts()
          .slice(0, 3)
          .map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
      </Reveal>
    </section>
  );
}
