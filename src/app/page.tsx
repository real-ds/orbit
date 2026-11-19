import { FeedView } from "@/components/feed/FeedView";
import { dummyArticles } from "@/data/dummy";

export default function HomePage() {
  return (
    <>
      <FeedView articles={dummyArticles} />
    </>
  );
}
