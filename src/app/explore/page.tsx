import { FeedView } from "@/components/feed/FeedView";
import { dummyArticles } from "@/data/dummy";

export default function ExplorePage() {
  return (
    <>
      <FeedView articles={dummyArticles} />
    </>
  );
}
