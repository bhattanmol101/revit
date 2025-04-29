"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";

import { fetchBusinessByIdAction } from "../../action";

import FnBForm from "@/components/forms/fnb";
import { Business } from "@/types/business";
import { getJoingDateString } from "@/utils/date-utils";
import { ContactIcon, LocationIcon, WebsiteIcon } from "@/components/icons";
import { useGlobalStore } from "@/store";

export default function BusinessReviewPage() {
  const { id } = useParams();

  const { globalState } = useGlobalStore((state) => state);

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business>();

  useEffect(() => {
    const fetchBusiness = async () => {
      const business = await fetchBusinessByIdAction(String(id));

      setLoading(false);
      if (business) {
        setBusiness(business);
      }
    };

    fetchBusiness();
  }, []);

  if (loading) {
    return <Spinner className="pt-4" />;
  }

  if (!business) {
    return <p>Could not fetch the business</p>;
  }

  return (
    <div className="p-2">
      <div className="flex flex-row items-center">
        <Avatar
          showFallback
          className="sm:w-24 sm:h-24 h-20 w-20"
          src={String(business?.logo)}
        />
        <div className="pl-5">
          <p className="sm:text-xl font-bold">{business?.name}</p>
          <p className="text-default-600 sm:text-sm text-sm">
            Since:{" "}
            {business && getJoingDateString(new Date(business.createdAt))}
          </p>
        </div>
      </div>

      <Divider className="my-3" />
      <div className="flex flex-row justify-evenly items-center px-4">
        {business.website && (
          <div className="flex flex-row items-center gap-2">
            <WebsiteIcon size={22} />
            <p className="text-default-600 sm:text-sm text-sm">
              {business.website}
            </p>
          </div>
        )}
        <div className="flex flex-row items-center gap-2">
          <LocationIcon size={22} />
          <p className="text-default-600 sm:text-sm text-sm">
            {business.location}
          </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <ContactIcon size={22} />
          <p className="text-default-600 sm:text-sm text-sm">
            {business.contact}
          </p>
        </div>
      </div>

      <Divider className="my-3" />
      <p className="bg-default-100 rounded-md py-2 px-3 font-semibold">
        Your review for{" "}
        <span className="text-primary-500">{business.name}</span>
      </p>
      <div className="py-6">
        <FnBForm business={business} user={globalState.user} />
      </div>
    </div>
  );
}
