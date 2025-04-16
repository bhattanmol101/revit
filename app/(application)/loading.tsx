import FeedItemSkeleton from "@/components/ui/feed-item-skeleton";

function Loading() {
  return (
    <div className="w-full px-2">
      <FeedItemSkeleton />
      <FeedItemSkeleton />
    </div>
  );
}

export default Loading;
