"use client";

import { useEffect, useState } from "react";

import { fetchAllBusinessAction } from "./action";
import BusinessFeedItem from "./_components/business-feed-item";

import { useGlobalStore } from "@/store";
import { Business } from "@/types/business";

export default function BusinessPage() {
  //   const { ref, inView } = useInView();

  const { globalState } = useGlobalStore((state) => state);

  //   const { feed, setFeed, page, setPage } = useFeedStore((state) => state);

  const [business, setBusiness] = useState<Business[]>();

  //   const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchForums = async (page: number) => {
      if (page != 0) {
        if (!globalState.auth) {
          return;
        }
        // setIsMoreLoading(true);
      }

      //   if (feed.data.length > page * POST_LIMIT) {
      //     setIsMoreLoading(false);

      //     return;
      //   }

      const resp = await fetchAllBusinessAction("");

      if (resp) {
        // setIsMoreLoading(false);
        setBusiness(resp);
      }
    };

    fetchForums(0);
  }, [globalState.auth]);

  //   if (page == 0 && feed.loading) {
  //     return <Loading />;
  //   }

  //   if (!feed.loading && feed.data.length == 0) {
  //     return (
  //       <p className="text-center mt-2 text-default-500 text-sm">
  //         No posts yet...
  //       </p>
  //     );
  //   }

  const renderBusiness = (business: Business) => {
    return <BusinessFeedItem key={business.id} business={business} />;
  };

  return (
    <div className="h-screen w-full">
      {business && business.flatMap(renderBusiness)}
      {/* <div ref={ref} className="flex flex-col justify-center items-center py-2">
        {inView && isMoreLoading && <Spinner />}
      </div> */}

      {!globalState.auth && (
        <p className="text-center pt-2 pb-5 text-default-500 text-base">
          See more reviews or share your experience{" "}
          <span className="text-primary-500">
            <a href="/signup">signup</a>
          </span>{" "}
          now on revit...
        </p>
      )}
    </div>
  );
}
