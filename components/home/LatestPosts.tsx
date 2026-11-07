import PostList from "@/components/home/PostList";
import SectionHeader from "@/components/home/SectionHeader";
import { listPosts } from "@/lib/posts";

// The three newest Open Science posts.
export default function LatestPosts() {
  return (
    <section className="section-y">
      <SectionHeader
        label="Open Science"
        title="Latest from the lab"
        link={{ href: "/open-science/", label: "All posts" }}
      />
      <PostList posts={listPosts().slice(0, 3)} />
    </section>
  );
}
